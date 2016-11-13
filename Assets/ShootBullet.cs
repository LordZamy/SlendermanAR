using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class ShootBullet : MonoBehaviour {
	public Button shootBullet;
	public GameObject Bullet_Emitter;
	public GameObject Bullet;
	public float Bullet_Forward_Force;
	private bool buttonPressed;
	// Use this for initialization
	void Start () {
		Button btn = shootBullet.GetComponent<Button> ();
		btn.onClick.AddListener (TaskOnClick);
		buttonPressed = false;
	
	}
	void FixedUpdate() {
		if (buttonPressed) {
			
			var Temporary_Bullet_Handler = Instantiate (Bullet, Bullet_Emitter.transform.position, Bullet_Emitter.transform.rotation) as GameObject;
			Physics.IgnoreCollision (Bullet_Emitter.GetComponent<Collider>(), Temporary_Bullet_Handler.GetComponent<Collider>());
			Temporary_Bullet_Handler.GetComponent<Rigidbody>().velocity = (transform.forward * Bullet_Forward_Force *-1);

			//Basic Clean Up, set the Bullets to self destruct after 10 Seconds, I am being VERY generous here, normally 3 seconds is plenty.
			Destroy (Temporary_Bullet_Handler, 3.0f);
			buttonPressed = false;
		}
	}
	
	// Update is called once per frame
	void TaskOnClick () {
		buttonPressed = true;
	}
}
