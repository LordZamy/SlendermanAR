using UnityEngine;
using System.Collections;

public class FollowTheTarget : MonoBehaviour {

	// the object our follower is attached to
	public GameObject target;

	private float moveSpeed = 0.1f;
	private const float MIN_SPEED = 0.1f;
	private const float MAX_SPEED = 1.0f;
	private float moveDist;

	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
		moveDist = moveSpeed * Time.deltaTime;

		// if distance < 2 then don't move
		float displacement = Vector3.Distance (this.transform.position, target.transform.position);
		if (displacement > 2) {
			this.transform.position = Vector3.MoveTowards(this.transform.position, target.transform.position, moveDist);

			if (displacement > 4) {
				if (moveSpeed < MAX_SPEED) {
					moveSpeed += 0.2f * Time.deltaTime;
				}
			} else {
				if (moveSpeed > MIN_SPEED) {
					moveSpeed -= 0.01f * Time.deltaTime;
				}
			}
		}
		print (moveSpeed);
	}
}
