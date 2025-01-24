import { useCallback, useEffect, useState } from "react";
import { queryFeatures } from "@esri/arcgis-rest-feature-service";
import { QueryFilter } from "../../../App";
import useCrimesContext from "../../../context/CrimesContext";
import {
  TorontoMCIFeature,
  TorontoQueryFeaturesResponse,
} from "../../../models/feature";

const TORONTO_MCI_ESRI_SERVICE_URL =
  "https://services.arcgis.com/S9th0jAJ7bqgIRjw/arcgis/rest/services/Major_Crime_Indicators_Open_Data/FeatureServer/0";

const buildWhereClause = (filter: QueryFilter) => {
  return Object.entries(filter)
    .filter(([key, value]) => !!value)
    .map(([key, value]) => `${key} = '${value}'`)
    .join(" AND ");
};

interface QueryState {
  values: TorontoMCIFeature[];
  resultOffset: number;
  loading?: boolean;
}

const usePaginatedQuery = (queryFilter: QueryFilter) => {
  const where = buildWhereClause(queryFilter);
  const { setCrimes } = useCrimesContext();

  const [queryState, setQueryState] = useState<QueryState>({
    values: [],
    resultOffset: 0,
    loading: true,
  });

  const loadFeaturePageFromServer = useCallback(async () => {
    if (!queryState.loading) {
      setCrimes(queryState.values);
      return;
    }

    const combinePagesTogether = (page: TorontoQueryFeaturesResponse) => {
      if (!page) {
        return;
      }

      setQueryState((current) => ({
        values: [...current.values, ...page.features],
        resultOffset: current.resultOffset + page.features.length,
        loading: page.exceededTransferLimit,
      }));
    };

    const json = (await queryFeatures({
      url: TORONTO_MCI_ESRI_SERVICE_URL,
      where,
      resultOffset: queryState.resultOffset,
    })) as TorontoQueryFeaturesResponse;

    combinePagesTogether(json);
  }, [
    where,
    queryState.loading,
    queryState.resultOffset,
    setQueryState,
    setCrimes,
  ]);

  useEffect(() => {
    loadFeaturePageFromServer();
  }, [loadFeaturePageFromServer]);

  return {
    features: queryState.values,
    loading: queryState.loading,
  };
};

export default usePaginatedQuery;
