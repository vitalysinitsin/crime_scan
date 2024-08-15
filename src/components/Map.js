import React, { useState, useRef, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import Marker from "./Marker";
import * as facilitiesJSON from "../utility/facilities.json";
//import { divisions_list } from '../utility/police_divisions';
//import build_crimes_query from '../utility/build_crimes_query';
import { useFetch } from "../utility/useFetch";

export default function Map() {
  const { facilities } = facilitiesJSON;
  const defaultCenter = { lat: 43.76681, lng: -79.41636 };
  const defaultZoom = 10;
  const [selected_facility, set_selected_facility] = useState({});
  const map_ref = useRef();
  const maps_ref = useRef();
  //const [bounds, set_bounds] = useState({});

  //  const [queryFilter, setQueryFilter] = useState({ 'reportedyear': '2020' });
  //  const crimes_query = build_crimes_query(queryFilter);
  //  const { data: points, loading } = useFetch(crimes_query);
  const url =
    "https://online.purenviro.com/api_getModel.php?ui=api_demo_user&p=xxxc57a988991dcc6a13deed3dd6e3024db97a5f2a8&t=2020-11-18+09:56";
  const { data: tomsPoints, loading } = useFetch(url);

  const reset_bounds = () => {
    if (!facilities.length) return;

    const new_bounds = new maps_ref.current.LatLngBounds();

    for (let i in facilities) {
      new_bounds.extend({ lat: facilities[i].lat, lng: facilities[i].lng });
    }
    // set_bounds(new_bounds);
    map_ref.current.fitBounds(new_bounds);
  };

  // Returns all nested equipments from the facility=>group tree
  const get_all_markers_from_selected_facility = () => {
    if (!selected_facility.groups || !selected_facility.groups.length) {
      return [];
    }

    console.log(selected_facility);
    return selected_facility.groups.reduce((previous, current) => {
      previous = previous.equipments ?? previous;

      return previous.concat(current.equipments);
    });
  };

  useEffect(() => {
    const fit_bounds_to_show_equipments = () => {
      const equipments = get_all_markers_from_selected_facility();

      if (!equipments?.length) return;

      const new_bounds = new maps_ref.current.LatLngBounds();

      for (let i in equipments) {
        new_bounds.extend({ lat: equipments[i].lat, lng: equipments[i].lng });
      }

      map_ref.current.fitBounds(new_bounds);
    };

    fit_bounds_to_show_equipments();
  }, [selected_facility]);

  const build_heatmap = () => {};

  return (
    <GoogleMapReact
      bootstrapURLKeys={{ key: "AIzaSyBF1Ft2aH0JXRxK2GAawdhBsyW7r8yyIdA" }}
      defaultCenter={defaultCenter}
      defaultZoom={defaultZoom}
      yesIWantToUseGoogleMapApiInternals
      onGoogleApiLoaded={({ map, maps }) => {
        map_ref.current = map;
        maps_ref.current = maps;
        reset_bounds();
      }}
      heatmap={!loading ? build_heatmap : {}}
      onClick={(e) => {
        console.log("mapclick\n", "lat: " + e.lat, "lng :" + e.lng);
        set_selected_facility({});
        reset_bounds();
      }}
    >
      {
        // ** police crimes
        //!loading && points.features.length &&
        //  points.features.map(point => {
        //    return(
        //      <Marker
        //        key={point.attributes.ObjectId}
        //        lat={point.geometry.y}
        //        lng={point.geometry.x}
        //        text={point.attributes.MCI}
        //      />
        //    );
        //  })
        //
        // ** police divisions
        //divisions_list.map(division => {
        //  return(
        //    <Marker
        //      key={division.name}
        //      lat={division.lat}
        //      lng={division.lng}
        //      text={division.name}
        //    />
        //  )
        //})
        // ** facilities
        facilities.map((facility) => {
          //bounds.extend({ lat: facility.lat, lng: facility.lng });

          return (
            <Marker
              className="mapMarker"
              onClick={(e) => {
                e.stopPropagation();
                set_selected_facility(facility);
                //set_bounds(new maps_ref.current.LatLngBounds());
              }}
              key={facility.id}
              lat={facility.lat}
              lng={facility.lng}
              text={facility.name}
              bg="rgb(50,50,50)"
            />
          );
        })
      }
      {selected_facility.groups?.map((group) => {
        if (!group.equipments.length) return null;

        const equipment_markers = group.equipments.map((equipment) => {
          //bounds.extend({ lat: equipment.lat, lng: equipment.lng });

          return (
            <Marker
              onClick={(e) => {
                e.stopPropagation();
              }}
              key={equipment.id}
              lat={equipment.lat}
              lng={equipment.lng}
              text={equipment.id}
              bg="rgb(150,50,50)"
            />
          );
        });

        //map_ref.current.fitBounds(bounds);

        return equipment_markers;
      })}
    </GoogleMapReact>
  );
}
