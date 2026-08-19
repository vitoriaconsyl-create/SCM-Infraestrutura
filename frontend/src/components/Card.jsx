import "../styles/card.css";

function Card({ titulo, valor }) {

    return (

        <div className="card">

            <h3>{titulo}</h3>

            <span>{valor}</span>

        </div>

    );

}

export default Card;