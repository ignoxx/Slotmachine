/* Variablen definieren */
var cash = 30;
var jackpot = 1000000;
var profit = 0;
var bet_value = 1;


//Timer / Spielzeit hier Festlegen
var minutes = 2;
var seconds = 0;

//Bilder variablen
var pic1 = 0;
var pic2 = 0;
var pic3 = 0;

//Debug
var count = 0;
var game_is_running = false;
var game_already_runned_once = false;

//End Game
var spin_counter = 0;
var used_cash = 0;
var gained_cash = 0;

//Bilder Vorladen
var BildListe = new Array(18);
for(i=0; i<18 ;i++)
{
 BildListe[i] = "Images/"+ i+1 + ".png";
}
			  
for (i = 0; i < BildListe.length; i++) 
{ 
 var Bild = new Image(); 
 Bild.src = BildListe[i]; 
}

/* Funktionen definieren */

//Gibt eine neue Nachricht auf dem display aus
function print( msgTitle, msg )
{
	var temp,message;
	message = "<strong>"+msgTitle+"</strong> "+msg;
	temp = '<div class="alert alert-dismissible alert-warning">'+message+'</div>';
	document.getElementById( "msgPos" ).innerHTML = temp;
	
	//remove alert message again
	window.setTimeout("document.getElementById( 'msgPos' ).innerHTML = '';", 7000);
}

//Decimal Punkt einfügen
function dot( Value )
{

	var StrValue = Value.toString();
	var tmp = new Array( 2 * ( StrValue.length ) );

	for(var i=StrValue.length-1, j=tmp.length-1, k=0 ; i>=0 ; i--, j--, k++)
	{
	  if(k%3==0 && i!=StrValue.length-1)
	  {
		tmp[j] = '.';
		j--;    
	  }
	  tmp[j] = StrValue.charAt( i );
	}

	return( tmp.join("") );
}

//Aktualisiert Spieler's Cash
function updateCash( Value, upJP )
{
	if(upJP){ document.getElementById( "outputJackpot" ).innerHTML = '<font color="red">Jackpot:</font>'+"0$";  }
	cash += parseInt( Value );
	document.getElementById( "outputCash" ).innerHTML =  cash;
}

//Timer
function startTimer()
{
	  if(!game_is_running && !game_already_runned_once)
	  {
		game_is_running = true;
		game_already_runned_once=true;
	  }
	
	  if( seconds == 0 )
	  {
		minutes --;
		seconds = 59;
	  } 
	  else
	  {
		seconds --;
	  }
	  
	  if( seconds > 9 )
	  {
		document.getElementById("outputTimer").innerHTML = "Spielzeit: "+minutes+":"+seconds;
	  }
	  else
	  {
		document.getElementById("outputTimer").innerHTML = "Spielzeit: "+minutes+":0"+seconds;
	  }
	  if ( minutes>0 || seconds >0 ){ window.setTimeout( "startTimer()", 1000 )}else
	  {
		game_is_running = false;
		
	  }
}

function gameEnd()
{
	game_is_running = false;
	//Form disable(n)
	document.getElementById('spinButton').setAttribute('disabled', 'disabled');
	document.getElementById('betValue').setAttribute('disabled', 'disabled');
	document.getElementById('endGameBtn').setAttribute('disabled', 'disabled');
	var outputText="";
	outputText="<strong>Du</strong> hast Insgesamt: <strong>"+used_cash+"$</strong> verwendet und insgesamt <strong>"+gained_cash+"$</strong> erspielt. Seite Neuladen um nochmal zu spielen!<br>";
	
	var temp;
	temp = '<div class="alert alert-dismissible alert-success">'+outputText+'</div>';
	document.getElementById( "msgPos" ).innerHTML = temp;
	
}

function check_spin_combi(slot1, slot2, slot3)
{
	var result = "";
	//Check pair
	if( slot1 == slot2 || slot2 == slot3 || slot3 == slot1){ result = "pair" ;}else

	//Check in order
	if( slot1 == slot2+1 && slot2 == slot3+1 && slot3 == slot1+1 ){ result = "in order" ;}else
	
	//Check 3 in a row
	if( slot1 == slot2 && slot2 == slot3 && slot3 == slot1 ){ result = "3 in a row" ;}else
	
	//Check normal jackpot 
	if( slot1 == 7 && slot2 == 7 &&  slot3 == 7 ){ result = "jackpot" ;}else
	
	//Check double jackpot
	if( slot1 == 16 && slot2 == 16 && slot3 == 16 ){ result = "double jackpot" ;}
	else
	{result = "nothing";}
	
	return( result );
}

function spinElements(Counter)
{
	//Alle 3 Fenster Spinnen und nacheinander stoppen
		count += Counter;	
		if( count <= 15  )
		{
			pic1 = Math.floor( (Math.random()*18)+1 );
			window.setTimeout(' document.getElementById("return1").src = "Images/" +' + pic1 + '+ ".png" ', 75);
		}
		
		if( count <= 30  )
		{
			pic2 = Math.floor( (Math.random()*18)+1 );
			window.setTimeout(' document.getElementById("return2").src = "Images/" +' + pic2 + '+ ".png" ', 75);
		}
		
		if( count <= 45  )
		{
			window.setTimeout('spinElements( 1 )', 100);
			
			pic3 = Math.floor( (Math.random()*18)+1 );
			window.setTimeout(' document.getElementById("return3").src = "Images/" +' + pic3 + '+ ".png" ', 75);
		}
		if( count > 45 )
		{
			//Spin Function
		
			//�berpr�fe m�gliche kombis
			var kombi="nothing", plusCash = 0, won=false;
			kombi = check_spin_combi(pic1, pic2, pic3);
			
			switch(kombi)
			{
				case "nothing":
					plusCash=0;
					won = false;
				break;
				
				case "pair":
					plusCash= bet * 2;
					won = true;
				break;
				
				case "jackpot":
					plusCash = jackpot;
					won = true;
				break;
				
				case "double jackpot":
					plusCash = jackpot * 2;
					won = true;
				break;
				
				case "in order":
					plusCash = bet * 5;
					won = true;
				break;
				
				case "3 in a row":
					plusCash = bet * 3;
					won = true;
				break;
			}	
			
			if( won )
			{
				print("Winner!", "Du hast gewonnen! <strong>+"+dot( plusCash )+"$</strong>"  );
				updateCash( plusCash,0 );
				//Benutzer
				gained_cash += plusCash;
			}
			
			count = 0;
			window.setTimeout("document.getElementById('spinButton').removeAttribute('disabled');", 200);
			window.setTimeout("document.getElementById('betValue').removeAttribute('disabled');", 200);
		}
}
//Nach aufruf wird die Maschine einmal gespinnt
function spinMachine( Counter )
{
	//alert
	if( !game_is_running && minutes > 0 ){ startTimer(); }
	
	
	if( cash > 0 )
	{
		if(game_is_running)
		{

				bet = Math.abs( parseInt( document.getElementById("betValue").value ) );
				if( (bet) <= cash)
				{
					updateCash(-bet,0 );
				}else{print("Achtung!","Du hast nicht genug Cash!");return 0;}
				
			303
				//Benutzer variablen
				spin_counter++
				used_cash += bet;
				
			
				//Form disable(n)
				document.getElementById('spinButton').setAttribute('disabled', 'disabled');
				document.getElementById('betValue').setAttribute('disabled', 'disabled');

			
				spinElements( 1 );
			}else
			{print("Achtung!","Deine Zeit ist abgelaufen!"); game_is_running=false;}
		}else
	{print("Achtung!", "Kein Cash mehr Vorhanden!"); game_is_running=false;}
}
