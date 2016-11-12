//------------------------------//
//  FlashlightBasicFlicker.js   //
//  Written by Alucard Jay      //
//  5/10/2013                   //
//------------------------------//

#pragma strict
@script RequireComponent( Light )

private var timer : float = 0.0;
private var timerMax : float = 60.0;

public var delayTimeBeforeEffect : float = 60.0;
public var delayTimeOffset : float = 20.0;

private var startIntensity : float;
private var currentIntensity : float;


function Start() 
{
	startIntensity = light.intensity;
	currentIntensity = startIntensity;
	
	GenerateMaxTime();
}


function Update() 
{
	timer += Time.deltaTime;
	
	if ( timer > timerMax )
	{
		timer = 0.0;
		GenerateMaxTime();
		
		switch( Random.Range( 0, 3 ) )
		{
			case 0 :
				MildFlicker();
			break;
			
			case 1 :
				FadeFlicker();
			break;
			
			case 2 :
				RandomIntensity();
			break;
		}
	}
} 


function GenerateMaxTime() 
{
	timerMax = delayTimeBeforeEffect + Random.Range( -delayTimeOffset, delayTimeOffset );
}


function MildFlicker() 
{
	// OFF
	currentIntensity = 0.0;
	light.intensity = currentIntensity;
	
	yield WaitForSeconds( 0.2 );
	
	// ON
	currentIntensity = startIntensity;
	light.intensity = currentIntensity;
	
	yield WaitForSeconds( 0.1 );
	
	// OFF
	currentIntensity = 0.0;
	light.intensity = currentIntensity;
	
	yield WaitForSeconds( 0.1 );
	
	// ON
	currentIntensity = startIntensity;
	light.intensity = currentIntensity;
	
	yield WaitForSeconds( 0.1 );
	
	// OFF
	currentIntensity = 0.0;
	light.intensity = currentIntensity;
	
	yield WaitForSeconds( 0.2 );
	
	// ON
	currentIntensity = startIntensity;
	light.intensity = currentIntensity;
	
	yield WaitForSeconds( 0.1 );
	
	// OFF
	currentIntensity = 0.0;
	light.intensity = currentIntensity;
	
	yield WaitForSeconds( 0.2 );
	
	// ON
	currentIntensity = startIntensity;
	light.intensity = currentIntensity;
	
	yield WaitForSeconds( 0.2 );
	
	// OFF
	currentIntensity = 0.0;
	light.intensity = currentIntensity;
	
	yield WaitForSeconds( 0.1 );
	
	// ON
	currentIntensity = startIntensity;
	light.intensity = currentIntensity;
}


function FadeFlicker() 
{
	var isFading : boolean = true;
	
	while( isFading )
	{
		currentIntensity -= 0.02;
		
		if ( currentIntensity < 0.0 )
		{
			currentIntensity = 0;
			isFading = false;
		}
		
		light.intensity = currentIntensity;
		
		yield;
	}
	
	
	// ON
	currentIntensity = startIntensity;
	light.intensity = currentIntensity;
	
	yield WaitForSeconds( 0.1 );
	
	// OFF
	currentIntensity = 0.0;
	light.intensity = currentIntensity;
	
	yield WaitForSeconds( 0.1 );
	
	// ON
	currentIntensity = startIntensity;
	light.intensity = currentIntensity;
	
	yield WaitForSeconds( 0.1 );
	
	// OFF
	currentIntensity = 0.0;
	light.intensity = currentIntensity;
	
	yield WaitForSeconds( 0.2 );
	
	// ON
	currentIntensity = startIntensity;
	light.intensity = currentIntensity;
}


function RandomIntensity() 
{
	var rndCount : int = 0;
	
	while( rndCount < 45 )
	{
		currentIntensity = Random.Range( 0.1, startIntensity );
		light.intensity = currentIntensity;
		
		rndCount ++;
		
		yield;
	}
	
	// ON
	currentIntensity = startIntensity;
	light.intensity = currentIntensity;
}
