using UnityEngine;
using System.Collections;

public class FollowTarget : MonoBehaviour {

	// the object our follower is attached to
	public GameObject target;

	private float moveSpeed = 0.2f;
	private float moveDist;

	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
		moveDist = moveSpeed * Time.deltaTime;

		// if distance < 2 then don't move
		if (Vector3.Distance (this.transform.position, target.transform.position) > 2) {
			this.transform.position = Vector3.MoveTowards(this.transform.position, target.transform.position, moveDist);
		}
	}
}
