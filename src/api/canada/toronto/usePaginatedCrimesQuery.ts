import { useEffect, useState } from "react";
import { queryFeatures } from "@esri/arcgis-rest-feature-service";
import { QueryFilter } from "../../../App";
import useCrimesContext from "../../../context/CrimesContext";
import {
  TorontoMCIFeature,
  TorontoQueryFeaturesResponse,
} from "../../../models/feature";
import buildWhereClause from "../../utility/buildWhereClause";

const TORONTO_MCI_ESRI_SERVICE_URL =
  "https://services.arcgis.com/S9th0jAJ7bqgIRjw/arcgis/rest/services/Major_Crime_Indicators_Open_Data/FeatureServer/0";

interface QueryState {
  values: TorontoMCIFeature[];
  resultOffset: number;
  loading?: boolean;
}

const usePaginatedQuery = (queryFilter: QueryFilter) => {
  const [queryState, setQueryState] = useState<QueryState>({
    values: [],
    resultOffset: 0,
    loading: false,
  });

  const where = buildWhereClause(queryFilter);
  const { setCrimes } = useCrimesContext();

  const resetQueryState = () => {
    setQueryState({ values: [], resultOffset: 0, loading: false });
  };

  useEffect(() => {
    if (!queryState.loading) {
      setCrimes(queryState.values);
      resetQueryState();
      return;
    }

    const loadFeaturePageFromServer = async () => {
      const combinePagesTogether = (page: TorontoQueryFeaturesResponse) => {
        if (!page) {
          return;
        }

        setQueryState((current) => ({
          ...current,
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
    };

    loadFeaturePageFromServer();
  }, [
    where,
    queryState.loading,
    queryState.resultOffset,
    setQueryState,
    setCrimes,
  ]);

  useEffect(() => {
    setQueryState((current) => ({ ...current, loading: true }));
  }, [where]);

  return {
    features: queryState.values,
    loading: queryState.loading,
  };
};

export default usePaginatedQuery;
