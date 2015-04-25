<?php
/**
 * Created by PhpStorm.
 * User: Baptiste
 * Date: 25/04/2015
 * Time: 14:20
 */

if( isset($_REQUEST["lat_min"]) && isset($_REQUEST["long_min"]) && isset($_REQUEST["lat_max"]) && isset($_REQUEST["long_max"]) ) {

    $json = file_get_contents("bornes_incendies_angers.json");
    $result = json_decode($json);
    $bornes = array();
    foreach($result->features as $borne) {
        $longitude = $borne->geometry->coordinates[0];
        $latitude = $borne->geometry->coordinates[1];
        if( $latitude >= $_REQUEST["lat_min"] && $latitude <= $_REQUEST["lat_max"] && $longitude >= $_REQUEST["long_min"]  && $longitude <= $_REQUEST["long_max"]) {
            $bornes[] = $borne;
        }
    }

    echo json_encode($bornes);
}


