 Vec3 dirFromMeToObject = (objPos - myPos).normal
 Vec3 myCurrentFacingDir = trans.forward
 
 if (Vec3.Dot(dirFromMeToObject, myCurrentFacingDir) > 0)
     //object is with a 180 degree arc in front of us
 
 if (Vec3.Dot(dirFromMeToObject, myCurrentFacingDir) > 0.5)
     //object is with a 90 degree arc in front of us
 
 if (Vec3.Dot(dirFromMeToObject, myCurrentFacingDir) > 0.75)
     //object is with a 45 degree arc in front of uss