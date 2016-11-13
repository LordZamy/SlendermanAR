using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class CollisionScript : MonoBehaviour {
	private int count;
	public Text countText;
	void Start() {
		count = 0;
		countText.text = "Count: " + count.ToString ();
	}
	void OnTriggerEnter(Collider other) {
		if (other.gameObject.CompareTag ("Collectable")) {
			other.gameObject.SetActive(false);
			count = count + 1;
			countText.text = "Count: " + count.ToString ();
		}
	}
}