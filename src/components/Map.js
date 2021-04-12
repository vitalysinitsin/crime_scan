import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import build_crimes_query from '../utility/build_crimes_query';
import { useFetch } from '../utility/useFetch';
import Marker from './Marker';
import { divisions_list } from '../utility/police_divisions';

export default function Map() {
  const defaultCenter = { lat: 43.76681, lng: -79.41636 };
  const defaultZoom = 12;
  const [queryFilter, setQueryFilter] = useState({ 'reportedyear': '2020' });
  const crimes_query = build_crimes_query(queryFilter);
  const { data: points, loading } = useFetch(crimes_query);

  return(
    <GoogleMapReact 
      bootstrapURLKeys={{ key: 'AIzaSyCoMeZ8bHHD1zQIFSslht_znET2EEyTK0s' }}
      defaultCenter={defaultCenter}
      defaultZoom={defaultZoom}
      yesIWantToUseGoogleMapApiInternals
    >
      {
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
        divisions_list.map(division => {
          return(
            <Marker
              key={division.name}
              lat={division.lat}
              lng={division.lng}
              text={division.name}
            />
          ) 
        })
      }
    </GoogleMapReact>
  );
}

