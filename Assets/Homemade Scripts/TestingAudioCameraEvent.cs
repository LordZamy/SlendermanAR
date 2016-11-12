using UnityEngine;
using System.Collections;
public class TestingAudioCameraEvent : MonoBehaviour {
    void start() {
        Debug.Log("Hello");
        var objectLook = GameObject.Find("Ethan");
        var myLook = GameObject.Find("Tango AR Camera");
        Vector3 dirFromMeToObject = (objectLook.transform.position - myLook.transform.position).normalized;
        Vector3 myCurrentFacingDir = transform.forward;
        if (Vector3.Dot(dirFromMeToObject, myCurrentFacingDir) > 0){
            Debug.Log("object is with a 180 degree arc in front of us");
        }
        if (Vector3.Dot(dirFromMeToObject, myCurrentFacingDir) > 0.5) {
            Debug.Log("object is with a 90 degree arc in front of us");
        }
        if (Vector3.Dot(dirFromMeToObject, myCurrentFacingDir) > 0.75) {
            Debug.Log("object is with a 45 degree arc in front of us");
        }
    }
 }