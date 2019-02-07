Date.prototype.clone = function () {
    return new Date(this.getTime());
}

Date.prototype.addSeconds = function(seconds) {
  var clone = this.clone()
  clone.setSeconds(clone.getSeconds() + seconds);
  return clone;
};

Date.prototype.addMinutes = function(minutes) {
  var clone = this.clone()
  clone.setMinutes(clone.getMinutes() + minutes);
  return clone;
};

Date.prototype.addHours = function(hours) {
  var clone = this.clone()
  clone.setHours(clone.getHours() + hours);
  return clone;
};

Date.prototype.addDays = function(days) {
  var clone = this.clone()
  clone.setDate(clone.getDate() + days);
  return clone;
};

Date.prototype.addWeeks = function(weeks) {
  var clone = this.clone()
  clone.addDays(weeks*7);
  return clone;
};

Date.prototype.addMonths = function (months) {
  var clone = this.clone()
  var dt = clone.getDate();

  clone.setMonth(clone.getMonth() + months);
  var currDt = clone.getDate();

  if (dt !== currDt) {
    clone.addDays(-currDt);
  }

  return clone;
};

Date.prototype.addYears = function(years) {
  var clone = this.clone()
  var dt = clone.getDate();

  clone.setFullYear(clone.getFullYear() + years);

  var currDt = clone.getDate();

  if (dt !== currDt) {
    clone.addDays(-currDt);
  }

  return clone;
};