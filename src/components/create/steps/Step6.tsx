import React from "react"
import Card from "../Card";
import RButton from "../../general/RButton";
import {Link} from "react-router-dom";

const Step6 = (props: {
    active: boolean,
}) => {
    return (
        <Card active={props.active}>
            <p>Gratulacje! Dodałeś utwory z radia do swojej playlisty! <br/> Przejdź do platformy Spotify i ciesz się muzyką
                wolną od reklam radiowych.</p>
            <Link to="/">
                <RButton className="mt-2">Powrót do strony głównej</RButton>
            </Link>
        </Card>
    )
}
export default Step6
