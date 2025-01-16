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

    const combinePagesTogether = (page: IQueryFeaturesResponse) => {
      if (!page) {
        return;
      }

      setQueryState((current) => ({
        paginatedFeaturesObj: {
          ...page,
          features: current.paginatedFeaturesObj?.features
            ? [...current.paginatedFeaturesObj.features, ...page.features]
            : page.features,
        },
        resultOffset: current.resultOffset + page.features.length,
        loading: page.exceededTransferLimit,
      }));
    };

    const json = (await queryFeatures({
      url: TORONTO_MCI_ESRI_SERVICE_URL,
      where,
      resultOffset: queryState.resultOffset,
    })) as IQueryFeaturesResponse;

    combinePagesTogether(json);
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
