import { QueryFilter } from "../../App";

const buildWhereClause = (filter: QueryFilter) => {
  return Object.entries(filter)
    .filter(([, value]) => !!value)
    .map(([key, value]) => `${key} = '${value}'`)
    .join(" AND ");
};

export default buildWhereClause;
