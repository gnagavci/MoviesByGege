import { useEffect, useState } from "react";

const Card = ({ title }) => {
  const [count, setCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  // it makes sense for each Card component to have a different hasLiked state, so we track state in the component code

  useEffect(() => {
    console.log(`${title} has been liked: ${hasLiked}`);
  }, [hasLiked]);
  // useEffect runs each time a component mounts
  /* the arrow function is the effect which happens, and the array is the dependecyArray, which activates the effect, anytime there is a change in its value*/

  return (
    <div className="card" onClick={() => setCount(count + 1)}>
      <h2>
        {title} <br /> {count || null}
        {/* {"count || null" is conditional rendering, count only shows if it is not 0} */}
      </h2>
      <button onClick={() => setHasLiked(!hasLiked)}>
        {hasLiked ? "❤️" : "🤍"}
        {/* conditional variable setting, if hasLiked=true, then display "Liked", else display "Like" */}
      </button>
    </div>
  );
};

const App = () => {
  return (
    <div className="card-container">
      <Card title="Star Wars" rating={5} isCool={true} />
      <Card title="Avatar" />
      <Card title="The Lion King" />
    </div>
  );
};

export default App;
