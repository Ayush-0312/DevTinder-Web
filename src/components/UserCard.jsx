import React from "react";

const UserCard = ({ user }) => {
  console.log(user);
  const { firstName, lastName, gender, age, about, skills, photoUrl } = user;
  return (
    <div>
      <div className="card bg-base-300 p-4 w-96 shadow-sm">
        <figure>
          <img src={photoUrl} alt="photo" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{firstName + " " + lastName}</h2>
          {age && gender && <p>{age + " " + gender}</p>}
          <p>{about}</p>
          <p>{skills.map((skill) => skill + ", ")}</p>
          <div className="card-actions justify-center my-4">
            <button className="btn btn-primary">Ignore</button>
            <button className="btn btn-secondary">Interested</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
