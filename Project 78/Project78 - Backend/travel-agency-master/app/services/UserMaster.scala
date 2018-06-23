package services

import akka.actor.{Actor, ActorRef, Props}
import model.Destination
import services.User.UserSpeech
import services.UserMaster.SpeechRequest

import scala.collection.mutable

object UserMaster {
  case class SpeechRequest(sessionUID: String, text: String)

  def props(destinations: Seq[Destination]) = Props(new UserMaster(destinations))
}

final class UserMaster(destinations: Seq[Destination]) extends Actor {
  type SessionUID = String

  val sessions = mutable.Map[SessionUID, ActorRef]()

  override def receive = {
    case SpeechRequest(sessionUID, text) =>
      val user = sessions.getOrElseUpdate(sessionUID, context.actorOf(User.props(destinations)))

      // and forward the request to the dedicated worker
      user forward UserSpeech(text)
  }
}
