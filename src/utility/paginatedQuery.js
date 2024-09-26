import { useCallback, useEffect, useState } from "react";
import { queryFeatures } from "@esri/arcgis-rest-feature-service";

const TORONTO_MCI_ESRI_SERVICE_URL =
  "https://services.arcgis.com/S9th0jAJ7bqgIRjw/arcgis/rest/services/Major_Crime_Indicators_Open_Data/FeatureServer/0";

const usePaginatedQuery = ({ where }) => {
  const [paginatedFeatures, setPaginatedFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resultOffset, setNewResultOffset] = useState(0);
  const [transferLimitExceeded, setTransferLimitExceeded] = useState(true);

  const loadFeaturePageFromServer = useCallback(async () => {
    const addAPage = (page) => {
      if (!page) {
        return;
      }

      setPaginatedFeatures([...paginatedFeatures, page]);
    };

    // end of all paging
    console.log("initialLimit", transferLimitExceeded);
    if (transferLimitExceeded === false) {
      setLoading(false);
      return;
    }

    console.log(resultOffset);
    const json = await queryFeatures({
      url: TORONTO_MCI_ESRI_SERVICE_URL,
      where,
      resultOffset,
    });
    console.log("response", json);
    addAPage(json);
    setNewResultOffset(resultOffset + json.features.length);
    setTransferLimitExceeded(json.tranferLimitExceeded);
  }, [where, resultOffset, transferLimitExceeded, setPaginatedFeatures]);

  useEffect(() => {
    loadFeaturePageFromServer();
  }, [loadFeaturePageFromServer]);

  return { data: paginatedFeatures, loading };
};

export default usePaginatedQuery;
