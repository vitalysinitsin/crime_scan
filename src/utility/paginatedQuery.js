import { useCallback, useEffect, useState } from "react";
import { queryFeatures } from "@esri/arcgis-rest-feature-service";

const TORONTO_MCI_ESRI_SERVICE_URL =
  "https://services.arcgis.com/S9th0jAJ7bqgIRjw/arcgis/rest/services/Major_Crime_Indicators_Open_Data/FeatureServer/0";

const usePaginatedQuery = ({ where }) => {
  const [queryState, setQueryState] = useState({
    paginatedFeaturesObj: {},
    resultOffset: 0,
    loading: true,
  });
  console.log({ queryState });

  const loadFeaturePageFromServer = useCallback(async () => {
    if (!queryState.loading) {
      return;
    }

    const addAPage = (page) => {
      if (!page) {
        return;
      }

      setQueryState({
        paginatedFeaturesObj: {
          ...page,
          features: queryState.paginatedFeaturesObj?.features
            ? [...queryState.paginatedFeaturesObj.features, ...page.features]
            : page.features,
        },
        resultOffset: queryState.resultOffset + page.features.length,
        loading: page.exceededTransferLimit,
      });
    };

    const json = await queryFeatures({
      url: TORONTO_MCI_ESRI_SERVICE_URL,
      where,
      resultOffset: queryState.resultOffset,
    });
    addAPage(json);
  }, [
    where,
    queryState.loading,
    queryState.resultOffset,
    queryState.paginatedFeaturesObj,
    setQueryState,
  ]);

  useEffect(() => {
    loadFeaturePageFromServer();
  }, [loadFeaturePageFromServer]);

  console.log(queryState.resultOffset);
  return {
    yearlyFeaturesObj: queryState.paginatedFeaturesObj,
    loading: queryState.loading,
  };
};

export default usePaginatedQuery;
