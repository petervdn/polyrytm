const findByProperty = (ref, propertyName, propertyValue) => {
  const query = ref
    .orderByChild(propertyName)
    .equalTo(propertyValue)
    .limitToFirst(1);

  return query.once('value').then(snapshot => {
    let result;
    snapshot.forEach(snapshotChild => {
      result = snapshotChild;
    });

    return result;
  });
};

exports.findByProperty = findByProperty;
