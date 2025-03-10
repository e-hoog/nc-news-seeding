const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createLookupObject = (databaseRow = [], targetKey, targetValue) => {
  const lookup = {}
  databaseRow.forEach((data) => {
      lookup[data[targetKey]] = data[targetValue]
  })
  return lookup
}