package controllers

import akka.actor.ActorSystem
import akka.pattern.ask
import akka.util.Timeout
import javax.inject._
import model.Destination
import play.api.Environment
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, Json, Reads, Writes}
import play.api.mvc._
import services.User.Response
import services.UserMaster.SpeechRequest
import services.{User, UserMaster}

import scala.concurrent.Future
import scala.concurrent.duration._

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class HomeController @Inject()(cc: ControllerComponents, environment: Environment, system: ActorSystem) (implicit assetsFinder: AssetsFinder)
  extends AbstractController(cc) {

  implicit val requestReads: Reads[User.Request] = (
    (JsPath \ "session_uid").read[String] and
      (JsPath \ "request").read[String]
    )(User.Request.apply _)

  implicit val destinationWrites: Writes[Destination] = (
    (JsPath \ "name").write[String] and
      (JsPath \ "images").write[Seq[String]] and
      (JsPath \ "activities").write[String] and
      (JsPath \ "weather").write[String] and
      (JsPath \ "price").write[Int]
    )(unlift(Destination.unapply))

  implicit val responseWrites: Writes[User.Response] = (
    (JsPath \ "response").write[String] and
      (JsPath \ "suggestions").write[Seq[Destination]]
    )(unlift(User.Response.unapply))

  val destinations = Destination.parse(environment.resourceAsStream("public/destinations.json").get)

  val userMaster = system.actorOf(UserMaster.props(destinations), name = "user-master")

  def index = Action(Ok("Hello World"))

  def post = Action.async { implicit request =>
    val userRequest = request
      .body.asText
      .map(text => Json.parse(text))
      .map(jsonValue => Json.fromJson(jsonValue)(requestReads).get)

    if (userRequest.isDefined) {
      implicit val timeout = Timeout(2.seconds)

      (userMaster ? SpeechRequest(userRequest.get.session_uid, userRequest.get.request))
        .mapTo[Response]
        .map(response => Ok(Json.toJson(response)))
    } else {
      Future(Ok(Json.toJson(Response(response = "Could you please try again?"))))
    }
  }
}
