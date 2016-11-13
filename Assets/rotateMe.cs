using UnityEngine;
using System.Collections;

public class rotateMe : MonoBehaviour {
	public GameObject cameraToRotate;
	public GameObject emptyToRotate;
	// Use this for initialization
	void Start () {
		emptyToRotate.transform.position = cameraToRotate.transform.position;
	}
	
	// Update is called once per frame
	void Update () {
		emptyToRotate.transform.rotation = cameraToRotate.transform.rotation;
	}
}
