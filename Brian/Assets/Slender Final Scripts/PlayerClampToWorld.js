//------------------------------//
//  PlayerClampToWorld.js       //
//  Written by Alucard Jay      //
//  5/10/2013                   //
//------------------------------//

#pragma strict

public var worldsizeMinX : float = 0.0;
public var worldsizeMaxX : float = 512.0;

public var worldsizeMinZ : float = 0.0;
public var worldsizeMaxZ : float = 512.0;

public var edgeOfWorldBuffer : float = 10.0;

private var myTransform : Transform;


function Start() 
{
	myTransform = transform;
}


function Update() 
{
	myTransform.position.x = Mathf.Clamp( myTransform.position.x, worldsizeMinX + edgeOfWorldBuffer, worldsizeMaxX - edgeOfWorldBuffer );
	myTransform.position.z = Mathf.Clamp( myTransform.position.z, worldsizeMinZ + edgeOfWorldBuffer, worldsizeMaxZ - edgeOfWorldBuffer );
}

