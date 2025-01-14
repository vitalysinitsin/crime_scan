import { useCallback, useEffect, useState } from "react";
import {
  IQueryFeaturesResponse,
  queryFeatures,
} from "@esri/arcgis-rest-feature-service";
import { QueryFilter } from "../../../App";

const TORONTO_MCI_ESRI_SERVICE_URL =
  "https://services.arcgis.com/S9th0jAJ7bqgIRjw/arcgis/rest/services/Major_Crime_Indicators_Open_Data/FeatureServer/0";

const buildWhereClause = (filter: QueryFilter) => {
  return Object.entries(filter)
    .filter(([key, value]) => !!value)
    .map(([key, value]) => `${key} = '${value}'`)
    .join(" AND ");
};

interface QueryState {
  paginatedFeaturesObj: IQueryFeaturesResponse | null;
  resultOffset: number;
  loading?: boolean;
}

const usePaginatedQuery = (queryFilter: QueryFilter) => {
  const where = buildWhereClause(queryFilter);

  const [queryState, setQueryState] = useState<QueryState>({
    paginatedFeaturesObj: null,
    resultOffset: 0,
    loading: true,
  });

  const loadFeaturePageFromServer = useCallback(async () => {
    if (!queryState.loading) {
      return;
    }

    const pushData = (jsonData: IQueryFeaturesResponse) => {
      if (!jsonData) {
        return;
      }

      setQueryState((current) => ({
        paginatedFeaturesObj: {
          ...jsonData,
          features: current.paginatedFeaturesObj?.features
            ? [...current.paginatedFeaturesObj.features, ...jsonData.features]
            : jsonData.features,
        },
        resultOffset: current.resultOffset + jsonData.features.length,
        loading: jsonData.exceededTransferLimit,
      }));
    };

    const json = (await queryFeatures({
      url: TORONTO_MCI_ESRI_SERVICE_URL,
      where,
      resultOffset: queryState.resultOffset,
    })) as IQueryFeaturesResponse;

    pushData(json);
  }, [where, queryState.loading, queryState.resultOffset, setQueryState]);

  useEffect(() => {
    loadFeaturePageFromServer();
  }, [loadFeaturePageFromServer]);

  return {
    featuresObject: queryState.paginatedFeaturesObj,
    loading: queryState.loading,
  };
};

export default usePaginatedQuery;
