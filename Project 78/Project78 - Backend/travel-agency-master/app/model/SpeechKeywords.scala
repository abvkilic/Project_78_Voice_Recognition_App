package model

object SpeechKeywords {
  val TripBooking = Set(
    "searching for a vacation",
    "go on a vacation",
    "to go to",
    "book a vacation",
    "book trip",
    "boek trip",
    "trip boeken",
    "boek een trip",
    "book a trip"
  )

  val BookForAmountOfPeople = Set(
    "for one person",
    "for two people",
    "for three people",
    "for four people",
    "for five people",
    "for six people"
  )

  val Greetings = Set(
    "hi",
    "hello",
    "hallo",
    "goedendag",
    "good day",
    "goedemorgen",
    "goodmorning",
    "good afternoon",
    "noon",
    "goedemiddag",
    "goedeavond",
    "goedenavond",
    "good evening"
  )

  val EuroPrices = {
    val range = 50 to 5000

    val plain = range.map(price => s"$price").toSet

    val euro = range.map(price => s"$price euro").toSet
    val token = range.map(price => s"€$price").toSet

    plain ++ euro ++ token
  }

  val TextPrices = Set(
    "fifty",
    "hundred",
    "hundred and fifty",
    "hundred fifty",
    "two hundred",
    "two hundred fifty",
    "two hundred and fifty",
    "three hundred",
    "three hundred fifty",
    "three hundred and fifty",
    "four hundred"
  )

  val Prices = EuroPrices ++ TextPrices

  val Warm = Set(
    "warm"
  )

  val Cold = Set(
    "cold"
  )

  val StayPlaces = Set(
    "hotel",
    "motel",
    "camping"
  )

  val Yes = Set(
    "yes",
    "no",
    "i do",
    "we do"
  )

  val No = Set(
    "no",
    "i dont",
    "i don't",
    "i do not",
    "we dont",
    "we don't",
    "we do not"
  )

  val Destinations = Set(
    "amsterdam",
    "parijs",
    "paris",
    "milan",
    "milaan",
    "new york",
    "london",
    "los angeles",
    "seattle",
    "athene",
    "berlijn",
    "beijing",
    "tokyo",
    "tenerife",
    "dubai",
    "belgie",
    "limburg",
    "schotland",
    "scotland",
    "egypt",
    "cairo",
    "india",
    "rome",
    "moscow",
    "rio de janeiro",
    "oslo",
    "rotterdam"
  )
}
