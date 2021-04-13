import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
//import build_crimes_query from '../utility/build_crimes_query';
//import { useFetch } from '../utility/useFetch';
import Marker from './Marker';
//import { divisions_list } from '../utility/police_divisions';
import { facilities } from '../utility/facilities';

export default function Map() {
  const defaultCenter = { lat: 43.76681, lng: -79.41636 };
  const defaultZoom = 12;
//  const [queryFilter, setQueryFilter] = useState({ 'reportedyear': '2020' });
//  const crimes_query = build_crimes_query(queryFilter);
//  const { data: points, loading } = useFetch(crimes_query);
  const [
    selected_facility_groups, 
    set_selected_facility_groups
  ] = useState([]);

  return(
    <GoogleMapReact 
      bootstrapURLKeys={{ key: 'AIzaSyCoMeZ8bHHD1zQIFSslht_znET2EEyTK0s' }}
      defaultCenter={defaultCenter}
      defaultZoom={defaultZoom}
      yesIWantToUseGoogleMapApiInternals
      onClick={(e) => {
        console.log('mapclick\n','lat: '+e.lat, 'lng :'+e.lng)
        set_selected_facility_groups([]); }}
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
        facilities.map(facility=> {
          return(
            <Marker
              className='mapMarker'
              onClick={(e)=>{
                e.stopPropagation();
                console.log(facility.groups);
                set_selected_facility_groups(facility.groups)
              }}
              key={facility.id}
              lat={facility.lat}
              lng={facility.lng}
              text={facility.name}
              bg='rgb(50,50,50)'
            />
          ) 
        })
      }
      {
        selected_facility_groups.length && 
        selected_facility_groups.map( group => {
          if (!group.equipments.length) return;
          
          return group.equipments.map( equipment => {
            return(
              <Marker
                key={equipment.id}
                lat={equipment.lat}
                lng={equipment.lng}
                text={equipment.id}
                bg='rgb(150,50,50)'
              />
            )
          });
        })
      }
    </GoogleMapReact>
  );
}

