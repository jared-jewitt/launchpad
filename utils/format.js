const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

module.exports.formatPath = (v) => v.trim().replace(/ +/g, "-").toLowerCase();

module.exports.formatSentence = (v) => capitalize(v.trim().replace(/-/g, " "));

module.exports.formatRepos = (filter, repos) => repos.data
  .filter(r => r.url.includes(filter))
  .map(r => ({
    label: r.description,
    value: r.name,
  }))
  .concat({
    label: "None",
    value: "",
  });
