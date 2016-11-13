using UnityEngine;
using UnityEngine.UI;
using System.Collections;
public class TakePhoto : MonoBehaviour {
	public GameObject objectLook;
	public GameObject myLook;
	public Button pictureTaker;
	private int num;
	public Text countText;
	void Start() {
		Button btn = pictureTaker.GetComponent<Button> ();
		btn.onClick.AddListener (TaskOnClick);
		num = -1;
		countText.text = "Count: " + num.ToString ();
		objectLook = GameObject.Find("EthanBody");
		myLook = GameObject.Find("Tango AR Camera");
	}
	void TaskOnClick() {
		Debug.Log ("Button Pressed!");
		Vector3 dirFromMeToObject = (objectLook.transform.position - myLook.transform.position).normalized;
		Vector3 myCurrentFacingDir = transform.forward;
		if (Vector3.Dot(dirFromMeToObject, myCurrentFacingDir) > 0.75) {
			Debug.Log("object is with a narrow degree arc in front of us");
			num = num - 1;
			countText.text = "Count: " + num.ToString ();
		}

	}
}
