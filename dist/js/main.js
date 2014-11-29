/* ================= / 
GLOBALS & SETUP
/  ================ */

var MaxStart = 50, /* The max starting point price */
	MarketSize = 75, /* How many corps? */
	CoinFlips = 50,  /* How many coin flips per interval */
	GameSpeed = 10, /* seconds */
	PlayerName = $.cookie( "PlayerName" ) || "", /* The players starting name */
	PlayerCash = $.cookie( "PlayerCash" ) || 10000, /* The players starting cash */
	TradeAmount = $( "#TradeAmount" ).val() || 10, /* The starting buy amount */
//	MaxDebt = -10000, /* Max debt the player is allowed before gameover (unused?!) */
	numAnimTime = 0.35; /* Animation time on numbers */

/* ================= /
SETUP & MAIN RUNNING SCRIPT
/  ================ */

var FlipCount = GameSpeed,
	AutoSaveCount = 0,
	cuniq_c = 1, // magic
	Change = 0,
	InMarket = 0,
	Corps = [],
	OwnedStocks = [],
	OwnedItems = $.cookie( "OwnedItems" ) ?
		$.cookie( "OwnedItems" ).split( "." ) :
		[ "owned" ];

/* Oh crumbs, here comes some huge honking data, hold onto your butts. */

var NounSrc = ["apple", "arm", "banana", "bike", "bird", "book", "chin", "clam",
		"class", "clover", "club", "corn", "crayon", "crow", "crown", "crowd", "crib",
		"desk", "dime", "dirt", "dress", "fang", "field", "flag", "flower", "fog",
		"game", "heat", "hill", "home", "horn", "hose", "joke", "juice", "kite", "lake",
		"maid", "mask", "mice", "milk", "mint", "meal", "meat", "moon", "mother",
		"morning", "name", "nest", "nose", "pear", "pen", "pencil", "plant", "rain",
		"river", "road", "rock", "room", "rose", "seed", "shape", "shoe", "shop",
		"show", "sink", "snail", "snake", "snow", "soda", "sofa", "star", "step",
		"stew", "stove", "straw", "string", "summer", "swing", "table", "tank", "team",
		"tent", "test", "toes", "tree", "vest", "water", "wing", "winter", "woman",
		"women", "alarm", "animal", "aunt", "bait", "balloon", "bath", "bead", "beam",
		"bean", "bedroom", "boot", "bread", "brick", "brother", "camp", "chicken",
		"children", "crook", "deer", "dock", "doctor", "downtown", "drum", "dust",
		"eye", "family", "father", "fight", "flesh", "food", "frog", "goose", "grade",
		"grandfather", "grandmother", "grape", "grass", "hook", "horse", "jail", "jam",
		"kiss", "kitten", "light", "loaf", "lock", "lunch", "lunchroom", "meal",
		"mother", "notebook", "owl", "pail", "parent", "park", "plot", "rabbit", "rake",
		"robin", "sack", "sail", "scale", "sea", "sister", "soap", "song", "spark",
		"space", "spoon", "spot", "spy", "summer", "tiger", "toad", "town", "trail",
		"tramp", "tray", "trick", "trip", "uncle", "vase", "winter", "water", "week",
		"wheel", "wish", "wool", "yard", "zebra", "actor", "airplane", "airport",
		"army", "baseball", "beef", "birthday", "boy", "brush", "bushes", "butter",
		"cast", "cave", "cent", "cherries", "cherry", "cobweb", "coil", "cracker",
		"dinner", "eggnog", "elbow", "face", "fireman", "flavor", "gate", "glove",
		"glue", "goldfish", "goose", "grain", "hair", "haircut", "hobbies", "holiday",
		"hot", "jellyfish", "ladybug", "mailbox", "number", "oatmeal", "pail",
		"pancake", "pear", "pest", "popcorn", "queen", "quicksand", "quiet", "quilt",
		"rainstorm", "scarecrow", "scarf", "stream", "street", "sugar", "throne",
		"toothpaste", "twig", "volleyball", "wood", "wrench", "advice", "anger",
		"answer", "apple", "arithmetic", "badge", "basket", "basketball", "battle",
		"beast", "beetle", "beggar", "brain", "branch", "bubble", "bucket", "cactus",
		"cannon", "cattle", "celery", "cellar", "cloth", "coach", "coast", "crate",
		"cream", "daughter", "donkey", "drug", "earthquake", "feast", "fifth", "finger",
		"flock", "frame", "furniture", "geese", "ghost", "giraffe", "governor", "honey",
		"hope", "hydrant", "icicle", "income", "island", "jeans", "judge", "lace",
		"lamp", "lettuce", "marble", "month", "north", "ocean", "patch", "plane",
		"playground", "poison", "riddle", "rifle", "scale", "seashore", "sheet",
		"sidewalk", "skate", "slave", "sleet", "smoke", "stage", "station", "thrill",
		"throat", "throne", "title", "toothbrush", "turkey", "underwear", "vacation",
		"vegetable", "visitor", "voyage", "year", "able", "achieve", "acoustics",
		"action", "activity", "aftermath", "afternoon", "afterthought", "apparel",
		"appliance", "beginner", "believe", "bomb", "border", "boundary", "breakfast",
		"cabbage", "cable", "calculator", "calendar", "caption", "carpenter",
		"cemetery", "channel", "circle", "creator", "creature", "education", "faucet",
		"feather", "friction", "fruit", "fuel", "galley", "guide", "guitar", "health",
		"heart", "idea", "kitten", "laborer", "language", "lawyer", "linen", "locket",
		"lumber", "magic", "minister", "mitten", "money", "mountain", "music",
		"partner", "passenger", "pickle", "picture", "plantation", "plastic",
		"pleasure", "pocket", "police", "pollution", "railway", "recess", "reward",
		"route", "scene", "scent", "squirrel", "stranger", "suit", "sweater", "temper",
		"territory", "texture", "thread", "treatment", "veil", "vein", "volcano",
		"wealth", "weather", "wilderness", "wren", "wrist", "writer"],
	AdjSrc = ["aback", "abaft", "abandoned", "abashed", "aberrant", "abhorrent",
		"abiding", "abject", "ablaze", "able", "abnormal", "aboard", "aboriginal",
		"abortive", "abounding", "abrasive", "abrupt", "absent", "absorbed",
		"absorbing", "abstracted", "absurd", "abundant", "abusive", "acceptable",
		"accessible", "accidental", "accurate", "acid", "acidic", "acoustic", "acrid",
		"actually", "ad hoc", "adamant", "adaptable", "addicted", "adhesive",
		"adjoining", "adorable", "adventurous", "afraid", "aggressive", "agonizing",
		"agreeable", "ahead", "ajar", "alcoholic", "alert", "alike", "alive", "alleged",
		"alluring", "aloof", "amazing", "ambiguous", "ambitious", "amuck", "amused",
		"amusing", "ancient", "angry", "animated", "annoyed", "annoying", "anxious",
		"apathetic", "aquatic", "aromatic", "arrogant", "ashamed", "aspiring",
		"assorted", "astonishing", "attractive", "auspicious", "automatic", "available",
		"average", "awake", "aware", "awesome", "awful", "axiomatic", "bad",
		"barbarous", "bashful", "bawdy", "beautiful", "befitting", "belligerent",
		"beneficial", "bent", "berserk", "best", "better", "bewildered", "big",
		"billowy", "bite-sized", "bitter", "bizarre", "black", "black-and-white",
		"bloody", "blue", "blue-eyed", "blushing", "boiling", "boorish", "bored",
		"boring", "bouncy", "boundless", "brainy", "brash", "brave", "brawny",
		"breakable", "breezy", "brief", "bright", "bright", "broad", "broken", "brown",
		"bumpy", "burly", "bustling", "busy", "cagey", "calculating", "callous", "calm",
		"capable", "capricious", "careful", "careless", "caring", "cautious",
		"ceaseless", "certain", "changeable", "charming", "cheap", "cheerful",
		"chemical", "chief", "childlike", "chilly", "chivalrous", "chubby", "chunky",
		"clammy", "classy", "clean", "clear", "clever", "cloistered", "cloudy",
		"closed", "clumsy", "cluttered", "coherent", "cold", "colorful", "colossal",
		"combative", "comfortable", "common", "complete", "complex", "concerned",
		"condemned", "confused", "conscious", "cooing", "cool", "cooperative",
		"coordinated", "courageous", "cowardly", "crabby", "craven", "crazy", "creepy",
		"crooked", "crowded", "cruel", "cuddly", "cultured", "cumbersome", "curious",
		"curly", "curved", "curvy", "cut", "cute", "cute", "cynical ", "daffy", "daily",
		"damaged", "damaging", "damp", "dangerous", "dapper", "dark", "dashing",
		"dazzling", "dead", "deadpan", "deafening", "dear", "debonair", "decisive",
		"decorous", "deep", "deeply", "defeated", "defective", "defiant", "delicate",
		"delicious", "delightful", "demonic", "delirious", "dependent", "depressed",
		"deranged", "descriptive", "deserted", "detailed", "determined", "devilish",
		"didactic", "different", "difficult", "diligent", "direful", "dirty",
		"disagreeable", "disastrous", "discreet", "disgusted", "disgusting",
		"disillusioned", "dispensable", "distinct", "disturbed", "divergent", "dizzy",
		"domineering", "doubtful", "drab", "draconian", "dramatic", "dreary", "drunk",
		"dry", "dull", "dusty", "dusty", "dynamic", "dysfunctional ", "eager", "early",
		"earsplitting", "earthy", "easy", "eatable", "economic", "educated",
		"efficacious", "efficient", "eight", "elastic", "elated", "elderly", "electric",
		"elegant", "elfin", "elite", "embarrassed", "eminent", "empty", "enchanted",
		"enchanting", "encouraging", "endurable", "energetic", "enormous",
		"entertaining", "enthusiastic", "envious", "equable", "equal", "erect",
		"erratic", "ethereal", "evanescent", "evasive", "even", "excellent", "excited",
		"exciting", "exclusive", "exotic", "expensive", "extra-large", "extra-small",
		"exuberant", "exultant", "fabulous", "faded", "faint", "fair", "faithful",
		"fallacious", "false", "familiar", "famous", "fanatical", "fancy", "fantastic",
		"far", "far-flung", "fascinated", "fast", "fat", "faulty", "fearful",
		"fearless", "feeble", "feigned", "female", "fertile", "festive", "few",
		"fierce", "filthy", "fine", "finicky", "first", "five", "fixed", "flagrant",
		"flaky", "flashy", "flat", "flawless", "flimsy", "flippant", "flowery",
		"fluffy", "fluttering", "foamy", "foolish", "foregoing", "forgetful",
		"fortunate", "four", "frail", "fragile", "frantic", "free", "freezing",
		"frequent", "fresh", "fretful", "friendly", "frightened", "frightening", "full",
		"fumbling", "functional", "funny", "furry", "furtive", "future", "futuristic",
		"fuzzy", "gabby", "gainful", "gamy", "gaping", "garrulous", "gaudy", "general",
		"gentle", "giant", "giddy", "gifted", "gigantic", "glamorous", "gleaming",
		"glib", "glistening", "glorious", "glossy", "godly", "good", "goofy",
		"gorgeous", "graceful", "grandiose", "grateful", "gratis", "gray", "greasy",
		"great", "greedy", "green", "grey", "grieving", "groovy", "grotesque",
		"grouchy", "grubby", "gruesome", "grumpy", "guarded", "guiltless", "gullible",
		"gusty", "guttural", "habitual", "half", "hallowed", "halting", "handsome",
		"handsomely", "handy", "hanging", "hapless", "happy", "hard", "hard-to-find",
		"harmonious", "harsh", "hateful", "heady", "healthy", "heartbreaking",
		"heavenly", "heavy", "hellish", "helpful", "helpless", "hesitant", "hideous",
		"high", "highfalutin", "high-pitched", "hilarious", "hissing", "historical",
		"holistic", "hollow", "homeless", "homely", "honorable", "horrible",
		"hospitable", "hot", "huge", "hulking", "humdrum", "humorous", "hungry",
		"hurried", "hurt", "hushed", "husky", "hypnotic", "hysterical", "icky", "icy",
		"idiotic", "ignorant", "ill", "illegal", "ill-fated", "ill-informed",
		"illustrious", "imaginary", "immense", "imminent", "impartial", "imperfect",
		"impolite", "important", "imported", "impossible", "incandescent",
		"incompetent", "inconclusive", "industrious", "incredible", "inexpensive",
		"infamous", "innate", "innocent", "inquisitive", "insidious", "instinctive",
		"intelligent", "interesting", "internal", "invincible", "irate", "irritating",
		"itchy", "jaded", "jagged", "jazzy", "jealous", "jittery", "jobless", "jolly",
		"joyous", "judicious", "juicy", "jumbled", "jumpy", "juvenile", "kaput", "keen",
		"kind", "kindhearted", "kindly", "knotty", "knowing", "knowledgeable", "known",
		"labored", "lackadaisical", "lacking", "lame", "lamentable", "languid", "large",
		"last", "late", "laughable", "lavish", "lazy", "lean", "learned", "left",
		"legal", "lethal", "level", "lewd", "light", "like", "likeable", "limping",
		"literate", "little", "lively", "lively", "living", "lonely", "long", "longing",
		"long-term", "loose", "lopsided", "loud", "loutish", "lovely", "loving", "low",
		"lowly", "lucky", "ludicrous", "lumpy", "lush", "luxuriant", "lying", "lyrical",
		"macabre", "macho", "maddening", "madly", "magenta", "magical", "magnificent",
		"majestic", "makeshift", "male", "malicious", "mammoth", "maniacal", "many",
		"marked", "massive", "married", "marvelous", "material", "materialistic",
		"mature", "mean", "measly", "meaty", "medical", "meek", "mellow", "melodic",
		"melted", "merciful", "mere", "messy", "mighty", "military", "milky",
		"mindless", "miniature", "minor", "miscreant", "misty", "mixed", "moaning",
		"modern", "moldy", "momentous", "motionless", "mountainous", "muddled",
		"mundane", "murky", "mushy", "mute", "mysterious", "naive", "nappy", "narrow",
		"nasty", "natural", "naughty", "nauseating", "near", "neat", "nebulous",
		"necessary", "needless", "needy", "neighborly", "nervous", "new", "next",
		"nice", "nifty", "nimble", "nine", "nippy", "noiseless", "noisy", "nonchalant",
		"nondescript", "nonstop", "normal", "nostalgic", "nosy", "noxious", "null",
		"numberless", "numerous", "nutritious", "nutty", "oafish", "obedient",
		"obeisant", "obese", "obnoxious", "obscene", "obsequious", "observant",
		"obsolete", "obtainable", "oceanic", "odd", "offbeat", "old", "old-fashioned",
		"omniscient", "one", "onerous", "open", "opposite", "optimal", "orange",
		"ordinary", "organic", "ossified", "outgoing", "outrageous", "outstanding",
		"oval", "overconfident", "overjoyed", "overrated", "overt", "overwrought",
		"painful", "painstaking", "pale", "paltry", "panicky", "panoramic", "parallel",
		"parched", "parsimonious", "past", "pastoral", "pathetic", "peaceful",
		"penitent", "perfect", "periodic", "permissible", "perpetual", "petite",
		"petite", "phobic", "physical", "picayune", "pink", "piquant", "placid",
		"plain", "plant", "plastic", "plausible", "pleasant", "plucky", "pointless",
		"poised", "polite", "political", "poor", "possessive", "possible", "powerful",
		"precious", "premium", "present", "pretty", "previous", "pricey", "prickly",
		"private", "probable", "productive", "profuse", "protective", "proud",
		"psychedelic", "psychotic", "public", "puffy", "pumped", "puny", "purple",
		"purring", "pushy", "puzzled", "puzzling", "quack", "quaint", "quarrelsome",
		"questionable", "quick", "quickest", "quiet", "quirky", "quixotic", "quizzical",
		"rabid", "racial", "ragged", "rainy", "rambunctious", "rampant", "rapid",
		"rare", "raspy", "ratty", "ready", "real", "rebel", "receptive", "recondite",
		"red", "redundant", "reflective", "regular", "relieved", "remarkable",
		"reminiscent", "repulsive", "resolute", "resonant", "responsible", "rhetorical",
		"rich", "right", "righteous", "rightful", "rigid", "ripe", "ritzy", "roasted",
		"robust", "romantic", "roomy", "rotten", "rough", "round", "royal", "ruddy",
		"rude", "rural", "rustic", "ruthless", "sable", "sad", "safe", "salty", "same",
		"sassy", "satisfying", "savory", "scandalous", "scarce", "scared", "scary",
		"scattered", "scientific", "scintillating", "scrawny", "screeching", "second",
		"second-hand", "secret", "secretive", "sedate", "seemly", "selective",
		"selfish", "separate", "serious", "shaggy", "shaky", "shallow", "sharp",
		"shiny", "shivering", "shocking", "short", "shrill", "shut", "shy", "sick",
		"silent", "silent", "silky", "silly", "simple", "simplistic", "sincere", "six",
		"skillful", "skinny", "sleepy", "slim", "slimy", "slippery", "sloppy", "slow",
		"small", "smart", "smelly", "smiling", "smoggy", "smooth", "sneaky", "snobbish",
		"snotty", "soft", "soggy", "solid", "somber", "sophisticated", "sordid", "sore",
		"sore", "sour", "sparkling", "special", "spectacular", "spicy", "spiffy",
		"spiky", "spiritual", "spiteful", "splendid", "spooky", "spotless", "spotted",
		"spotty", "spurious", "squalid", "square", "squealing", "squeamish", "staking",
		"stale", "standing", "statuesque", "steadfast", "steady", "steep",
		"stereotyped", "sticky", "stiff", "stimulating", "stingy", "stormy", "straight",
		"strange", "striped", "strong", "stupendous", "stupid", "sturdy", "subdued",
		"subsequent", "substantial", "successful", "succinct", "sudden", "sulky",
		"super", "superb", "superficial", "supreme", "swanky", "sweet", "sweltering",
		"swift", "symptomatic", "synonymous", "taboo", "tacit", "tacky", "talented",
		"tall", "tame", "tan", "tangible", "tangy", "tart", "tasteful", "tasteless",
		"tasty", "tawdry", "tearful", "tedious", "teeny", "teeny-tiny", "telling",
		"temporary", "ten", "tender", "tense", "tense", "tenuous", "terrible",
		"terrific", "tested", "testy", "thankful", "therapeutic", "thick", "thin",
		"thinkable", "third", "thirsty", "thirsty", "thoughtful", "thoughtless",
		"threatening", "three", "thundering", "tidy", "tight", "tightfisted", "tiny",
		"tired", "tiresome", "toothsome", "torpid", "tough", "towering", "tranquil",
		"trashy", "tremendous", "tricky", "trite", "troubled", "truculent", "true",
		"truthful", "two", "typical", "ubiquitous", "ugliest", "ugly", "ultra",
		"unable", "unaccountable", "unadvised", "unarmed", "unbecoming", "unbiased",
		"uncovered", "understood", "undesirable", "unequal", "unequaled", "uneven",
		"unhealthy", "uninterested", "unique", "unkempt", "unknown", "unnatural",
		"unruly", "unsightly", "unsuitable", "untidy", "unused", "unusual", "unwieldy",
		"unwritten", "upbeat", "uppity", "upset", "uptight", "used", "useful",
		"useless", "utopian", "utter", "uttermost", "vacuous", "vagabond", "vague",
		"valuable", "various", "vast", "vengeful", "venomous", "verdant", "versed",
		"victorious", "vigorous", "violent", "violet", "vivacious", "voiceless",
		"volatile", "voracious", "vulgar", "wacky", "waggish", "waiting", "wakeful",
		"wandering", "wanting", "warlike", "warm", "wary", "wasteful", "watery", "weak",
		"wealthy", "weary", "well-groomed", "well-made", "well-off", "well-to-do",
		"wet", "whimsical", "whispering", "white", "whole", "wholesale", "wicked",
		"wide", "wide-eyed", "wiggly", "wild", "willing", "windy", "wiry", "wise",
		"wistful", "witty", "woebegone", "womanly", "wonderful", "wooden", "woozy",
		"workable", "worried", "worthless", "wrathful", "wretched", "wrong", "wry",
		"xenophobic", "yellow", "yielding", "young", "youthful", "yummy", "zany",
		"zealous", "zesty", "zippy", "zonked"],
	CoSrc = [" ", " ", ".gov ", ".io ", " group"," incorporated"," corp",
		" industries", ".com "];

/* And breath out! */

function FlipInterval() {
	if ( FlipCount === GameSpeed ) {
		$( "#StocksBoard" ).find( "tr:gt(0)" ).remove();
		for ( var i = 0; i < MarketSize; i++ ) {
			var Obj = Corps[ i ];
			Obj.point = FlipCoin( Obj.point, GetNSetBias( Obj ), CoinFlips);
			/* Calculate direction into arrow format */
			var Dir = "Error";
			if ( Obj.last1 > Obj.point ) {
				Dir = "\\/";
			} else if ( Obj.last1 < Obj.point ) {
				Dir = "/\\";
			} else if ( Obj.last1 === Obj.point ) {
				Dir = "-";
			}
			Obj.dir = Dir;
			/* Build it in HTML */
			AddToStocksBoard( Corps[ i ], i );
			/* Console log for techies */
			//console.log(Obj.id+', '+Obj.point+', '+GotBias+", "+Dir);
			//console.log(Obj.last1+', '+Obj.last2+', '+Obj.last3);
		}
		UpdateHUD();
		setTimeout( FlipInterval, 1000 );
		FlipCount = 0;
		if ( AutoSaveCount === 3) {
			SaveGame();
			AutoSaveCount = 0;
		} else {
			AutoSaveCount++;
		}
	} else {
		FlipCount++;
		$( ".GameSpeedTag" ).text( GameSpeed - FlipCount );
		setTimeout( FlipInterval, 1000 );
	}
}

/* ================= /
FUNCTIONS & TOOLS
/  ================ */

$( "#PlayerName" ).on( "change", function() {
	PlayerName = this.value;
	SaveGame();
});

$( "#TradeAmount" ).on( "keyup change", function() {
	TradeAmount = this.value;
});

$( "#MarketSize" ).on( "keyup change", function() {
	if ( this.value !== "" ) {
		MarketSize = this.value;
	}
	GenMarket();
});

$( "#CoinFlips" ).on( "keyup change", function() {
	if ( this.value !== "" ) {
		CoinFlips = this.value;
	}
});

$( "#GameSpeed" ).on( "keyup change", function() {
	if ( this.value !== "" ) {
		GameSpeed = this.value;
		FlipCount = GameSpeed;
	}
});

$( document.body )
	.on( "click", "input[type=text]", function() {
		this.select();
	})
	.on( "click", ".BuyLink", function() {
		var ind = $( this ).data( "index" );
		BuyStock( ind, parseFloat( TradeAmount ) );
		UpdateHUD();
	})
	.on( "click", ".SellLink", function() {
		var ind = $( this ).data( "index" );
		SellStock( ind, parseFloat(TradeAmount) );
		UpdateHUD();
	})
	.on( "click", ".ItemBuyLink", function() {
		var ind = $( this ).data( "index" );
		BuyItem( ind );
	});

$( "#GameSave" ).click(function() {
	SaveGame();
});	

$( "#BizCard" ).click(function() {
	var Url = GenProfileUrl();
	history.replaceState( null, null, '?p=' + Url );
	ShowProfile( Url );
});

$( "#ProfileModal" ).on( "hidden.bs.modal", function() {
	history.replaceState( null, null, location.pathname );
});

$( "#ShowOwn" ).click(function() {
	$( "#StocksBoard" ).toggleClass( "ShowOwn" );
	$( "#ShowOwn" ).toggleClass( "btn-success" );
});

/* End of Horrible Listeners, Begin of proper stuff */

function SaveGame() {
	$.cookie( "PlayerName", PlayerName, { expires: 99 });
	$.cookie( "PlayerCash", PlayerCash, { expires: 99 });
	$.cookie( "OwnedItems", OwnedItems.join( "." ), { expires: 99 });
	$( "#SavedTag" ).toggleClass( "invisible" );
	setTimeout(function() {
		// toggle back after 1 second
		$( "#SavedTag" ).toggleClass( "invisible" );
	}, 1500 );
}

function GenMarket() {
	for ( var i = 0; i < MarketSize; i++ ) {
		var Adj = RandomVal( AdjSrc ),
			Noun = RandomVal( NounSrc ),
			Co = RandomVal( CoSrc ),
			Name = Adj.value + " " + Noun.value + Co.value;
		Corps.push({
			id: cuniq(),
			name: Name,
			ticker: TickerGen( Name ),
			namesrc: Adj.index + "." + Noun.index + "." + Co.index,
			point: Math.round( Math.random() * (0 - MaxStart) + MaxStart),
			last1: 0,
			last2: 0,
			last3: 0,
			dir: "="
		});
		AddToStocksBoard( Corps[ i ], i);
	}
}

function FlipCoin( Coin, Bias, Flips ) {
	/* Yup, that simple */
	var Max = 1 + Bias;
	for ( var i = 0; i < Flips; i++ ) {
		if ( Math.round( Math.random() * (0 - Max) + Max ) === 0 ) {
			Coin = Coin - 1;
		} else {
			Coin = Coin + 1;
		}
	}
	if ( Coin <= 0) {
		Coin = 1;
	}
	return Coin;
}

function GetNSetBias( Obj ) {
	var Bias = 0,
		last = Obj.point;

	/* Get New Bias */
	if ( Obj.last1 >= last ) { /* Past higher than now */
		Bias = Bias - 0.05;
	}
	if ( Obj.last2 >= Obj.last1) { /* Lower expectations */
		Bias = Bias - 0.05;
	}
	if ( Obj.last3 >= Obj.last2) {
		Bias = Bias - 0.05;
	}
	if ( Obj.last1 <= last ) { /* Past lower than now */
		Bias = Bias + 0.05;
	}
	if ( Obj.last2 <= Obj.last1 ) { /* Increase expectations */
		Bias = Bias + 0.05;
	}
	if ( Obj.last3 <= Obj.last2 ) {
		Bias = Bias + 0.05;
	}

	/* Set Previous Three */
	Obj.last3 = Obj.last2; 
	Obj.last2 = Obj.last1;
	Obj.last1 = last;

	return precise_round( Bias, 2 );
}

function precise_round( num, decimals ) {
	return Math.round( num * Math.pow( 10, decimals ) ) / Math.pow( 10, decimals );
}

function numberWithCommas( x ) {
return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function GetDiff( a, b ) {
	return Math.abs( a - b );
}

// Need to double check the rewrite of this.
function cuniq() {
	var cuniq_d = new Date(),
		cuniq_m = cuniq_d.getMilliseconds() + "",
		cuniq_u = ++cuniq_d + cuniq_m;
	if ( ++cuniq_c === 10000 ) {
		cuniq_c = 1;
	}
	cuniq_u += cuniq_c;
	return cuniq_u;
}

function BuyStock( ind, amount ) {
	PlayerCash = PlayerCash - (amount * Corps[ ind ].point); /* Take payment */
	// Verify right type check: http://contribute.jquery.org/style-guide/js/#type-checks
	if( typeof OwnedStocks[ ind ] === "undefined") {
		OwnedStocks[ ind ] = { amount: 0, original: Corps[ ind ].point };
		OwnedStocks[ ind ].amount = amount;
	} else {
		OwnedStocks[ ind ].amount = OwnedStocks[ ind ].amount + amount;
		OwnedStocks[ ind ].original = OwnedStocks[ ind ].original + Corps[ ind ].point;
	}
	/* Add to portfolio */
	Change = 0;
	UpdateHUD();
	AddToStocksBoard( Corps[ ind ], ind );
}

function SellStock( ind, amount ) {
	// Verify right type check: http://contribute.jquery.org/style-guide/js/#type-checks
	if ( typeof OwnedStocks[ ind ] !== "undefined") {
		if ( amount > OwnedStocks[ ind ].amount ) {
			amount = OwnedStocks[ ind ].amount;
		}
		if ( OwnedStocks[ ind ].amount - amount >= 0 ) {
			PlayerCash = PlayerCash + (amount * Corps[ ind ].point); /* Make payment */
			PlayerCash = PlayerCash < 0 ? 0 : PlayerCash;
			OwnedStocks[ ind ].amount = OwnedStocks[ ind ].amount - amount;
		}
		OwnedStocks[ ind ].original = OwnedStocks[ ind ].original - Corps[ ind ].point;
	}
	if ( OwnedStocks[ ind ].amount <= 0) {
		OwnedStocks[ind] = undefined; /* kill it */
	}
	/* remove from portfolio */
	Change = 0;
	UpdateHUD();
	AddToStocksBoard( Corps[ ind ], ind );
}

function StocksOwned( ind ) {
	// Verify right type check: http://contribute.jquery.org/style-guide/js/#type-checks
	if ( typeof OwnedStocks[ ind ] !== "undefined") {
		return OwnedStocks[ ind ].amount;
	} else {
		return 0;
	}
}

function CashInMarket( ind ) {
	var Cash = 0;
	if (ind === "all" ) {
		for ( var i = 0; i < OwnedStocks.length ; i++ ) {
			// Verify right type check: http://contribute.jquery.org/style-guide/js/#type-checks
			if ( typeof OwnedStocks[ i ] !== "undefined" ) {
				Cash = Cash + OwnedStocks[ i ].amount * Corps[ i ].point;
			}
		}
	} else {
		// Verify right type check: http://contribute.jquery.org/style-guide/js/#type-checks
		if ( typeof OwnedStocks[ ind ] !== "undefined" ) {
			Cash = Cash + OwnedStocks[ ind ].amount * Corps[ ind ].point;
		}
	}
	return Cash;
}

function AvgPriceDiff( ind ) {
	var AvgPaid = OwnedStocks[ ind ].original / OwnedStocks[ ind ].amount;
	return Corps[ ind ].point - AvgPaid;
}

function RandomVal( Arr ) { /* Return the random value & also the index of the value */
	var ind = Math.floor( Math.random() * Arr.length );
	return { value: Arr[ ind ], index: ind };
}

function getURLParameter( name ) {
	// Line needs to be shortened.
	return decodeURIComponent((new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(location.search)||[,""])[1].replace(/\+/g, "%20"))||null;
}

function isNumber( n ) {
	return !isNaN( parseFloat( n ) ) && isFinite( n );
}

// Converts an integer (unicode value) to a char
function itoa( i ) {
	var base = "abcdefghijklmnopqrstuvwxyz-",
		Output = "";
	for ( var a = 0, len = i.length; a < len; a++ ) {
		if ( !isNumber( i[ a ] ) ) {
			Output += base.indexOf( i[ a ] );
		} else {
			Output += base.charAt( i[ a ] );
		}
	}
	return Output;
}

function GenProfileUrl() {
	return (OwnedItems.length-1) + "/" +
		itoa( String( PlayerCash ).replace( "-", "0") ) + "/" + 
		encodeURIComponent( PlayerName ) + "/";
}

function ShowProfile( para ) {
	var Arr = para.split( "/" ),
		LCash = itoa( Arr[ 1 ] );
	LCash = LCash.indexOf( "0" ) === 0 ? "-" + LCash.substring( 1 ) : LCash;
	$( ".modal-body" ).html( "<h2>" + decodeURI( Arr[ 2 ] ) +
		"</h2><br><br><h3>" + StoreItems[ Arr[ 0 ] ].desc +
		"</h3><br><br><h3>BANKED: $" + numberWithCommas(LCash) +
		"</h3><br><br><h3>Tel: 311-555-2368</h3>" );
	$( "#ProfileModal" ).modal( "show" );
}

function TickerGen( Name ) {
	var Words = Name.split( ' ' ),
		ThirdLetter = Words[ Words.length - 2 ].charAt( 0 );
	return (Name.charAt( 0 ) + Name.charAt( 1 ) + ThirdLetter).toUpperCase();
}

/* Builder functions here, messy messy messy! */

function AddToStocksBoard( Obj, ind ) {
	var Tooltip ='disabled="disabled"',
		Cash = '',
		XClass = '';
	// Verify right type check: http://contribute.jquery.org/style-guide/js/#type-checks
	if ( typeof OwnedStocks[ ind ] !== "undefined") {
		if ( OwnedStocks[ ind ].amount > 0) {
			XClass = ' owned';
			Tooltip = 'data-toggle="hover" data-placement="top" title="" data' +
				'-original-title="Profit per stock: $' + AvgPriceDiff( ind ) +
				'" ';
			Cash = "$" + CashInMarket( ind ) + " (" + StocksOwned( ind ) + ")";
		}
	}

	var Dir = '<span class="glyphicon glyphicon-minus"><\/span>';
	if ( Obj.dir === '/\\' ) {
		XClass = 'success' + XClass;
		Dir = '<span class="glyphicon glyphicon-chevron-up"><\/span>';
	} else if ( Obj.dir === '\\/') {
		XClass = 'danger' + XClass;
		Dir = '<span class="glyphicon glyphicon-chevron-down"><\/span>';
	}

	var sellButton = '<button type="button" data-index="' + ind + '" ' +
		Tooltip + 'class="SellLink btn btn-sm btn-default">Sell<\/button>';

	var content = '<tr id="' + Obj.id + '_row" class="' + XClass + '"><td>' +
		Obj.ticker + '<\/td><td>' + Obj.name + '<\/td><td>$' + Obj.point +
		'<\/td><td class="CashInMarket">' + Cash + '<\/td><td>' + Dir + ' ' +
		GetDiff( Obj.point, Obj.last2 ) +
		'<\/td><td><button type="button" data-index="' + ind +
		'" class="BuyLink btn btn-sm btn-info">Buy<\/button><\/td><td>' +
		sellButton + '<\/td><\/tr>';

	if ( !document.getElementById( Obj.id + '_row' ) ) {
		$( "#StocksBoard tr:last").after( content );
	} else {
		//$( "#" + Obj.id + "_row" ).replaceWith( content );
		$( "#" + Obj.id + "_row" ).removeClass().addClass( XClass );
		$( "#" + Obj.id + "_row" ).find( "td" ).eq( 2 ).html( "$" + Obj.point );
		$( "#" + Obj.id + "_row" ).find( "td" ).eq( 3 ).html( Cash );
		$( "#" + Obj.id + "_row" ).find( "td" ).eq( 4 )
			.html( Dir + " " + GetDiff( Obj.point, Obj.last2 ) );
		$( "#" + Obj.id + "_row" ).find( "td" ).eq( 6 ).html( sellButton );
	}

	$('.SellLink').tooltip();
}

function UpdateHUD() {
	var numAnim;
	$( "#PlayerName" ).val( PlayerName );
	$( "#OwnedItemTag" ).html( StoreItems[ OwnedItems.length - 1 ].desc );

	if ( Change === 0) {
		// Currently broken due to countUp update.
		numAnim = new countUp( "PlayerCash", 0, PlayerCash, 0, numAnimTime );
		numAnim.start();
	}
	$( "#PlayerCash" ).html( numberWithCommas( PlayerCash ) ); //As a backup incase above fails.

	if ( InMarket !== CashInMarket("all") ) {
		numAnim = new countUp( "CashInMarket", InMarket, CashInMarket( "all" ), 0, numAnimTime );
		numAnim.start();
		InMarket = CashInMarket( "all" );
	}
	$( "#CashInMarket" ).text( numberWithCommas( CashInMarket( "all" ) ) ); //As a backup incase above fails.
	GenStore();
	Change = 1;
}

/* === END OF MARKET SCRIPT === */

/* === BEGIN OF STORE & PROFILE SCRIPT === */

var StoreItems = [
	{
		"name": "Maple Hills Condo",
		"desc": "Proud Maple Hills Condo Owner",
		"cost": 25000
	},
	{
		"name": "Celebrity Status",
		"desc": "Popular Narcissist, MK Ultra Slave",
		"cost": 30000
	},
	{
		"name": "Maple Hills Mayorship",
		"desc": "Maple Hills Mayor",
		"cost": 50000
	},
	{
		"name": "Valmont State Governorship",
		"desc": "Valmont State Governor",
		"cost": 1000000
	},
	{
		"name": "Position In Congress",
		"desc": "Congressman",
		"cost": 5000000
	},
	{
		"name": "Friends In Very High Places",
		"desc": "Plutocrat, Illuminate, Reptillian",
		"cost": 10000000
	},
	{
		"name": "Vice Presidency of The United States",
		"desc": "Vice President of The United States, NWO Puppet",
		"cost": 50000000
	},
	{
		"name": "Presidency of The United States",
		"desc": "President of The United States, NWO Puppet",
		"cost": 100000000
	},
	{
		"name": "Boulderberg Group Membership",
		"desc": "Proud Illuminate & NWO Citizen &#9650;",
		"cost": 200000000
	},
	{
		"name": "\"Agency\" Directorship",
		"desc": "Shadow Government Controller &#9650;",
		"cost": 200000000
	},
	{
		"name": "Extraterrestrial Alliance",
		"desc": "Ascended Being, A Higher Power &#9650;",
		"cost": 300000000
	}
];

function AddToStoreBoard( Obj, ind ) {
	var XClass = '',
		Button = '<button type="button" data-index="' + ind +
			'" class="ItemBuyLink btn btn-sm btn-info">Buy<\/button>';
	if ( Obj.cost > PlayerCash) {
		Button = '<button type="button" class="ItemBuyLink btn btn-sm btn-default" disabled="disabled">Insufficient Funds<\/button>';
	}
	// Verify right type check: http://contribute.jquery.org/style-guide/js/#type-checks
	if ( typeof OwnedItems[ ind ] !== "undefined") {
		XClass = 'ItemOwned';
		Button = '<button type="button" class="ItemBuyLink btn btn-sm btn-info" disabled="disabled">Purchased<\/button>';
	}

	var content = '<tr id="item_' + ind + '_row" class="' + XClass + '"><td>' +
		Obj.name + '<\/td><td>' + '$' + numberWithCommas( Obj.cost ) +
		'<\/td><td>' + Button + '<\/td><\/tr>';

	if ( !document.getElementById( 'item_' + ind + '_row' ) ) {
		$( "#StoreBoard tr:last" ).after( content );
	} else {
		$( "#item_" + ind + "_row").replaceWith( content );
	}
}

function GenStore(){
	for ( var i = 0; i < StoreItems.length; i++ ) {
		AddToStoreBoard( StoreItems[ i ], i );
	}
}

function BuyItem(ind) {
	PlayerCash = PlayerCash - StoreItems[ ind ].cost; /* Take payment */
	OwnedItems[ ind ] = "owned";
	/* Add to portfolio */
	Change = 0;
	UpdateHUD();
	GenStore();
}

/* All together now.. */
if ( getURLParameter("p") ) { //Show any profiles linked to
	ShowProfile( getURLParameter('p') );
}
$(".tooltipTog").tooltip();
GenMarket();
GenStore();
FlipInterval();
UpdateHUD();
