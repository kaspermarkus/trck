export default {
  timeSpent: function (start, end) {
    var zeroPrefix = (num) => (num < 10 ? "0" + num : num);

    var diff = (end - start) / 1000;
    var hh = Math.floor(diff / 60 / 60);
    diff -= hh * 60 * 60;
    var mm = Math.floor(diff / 60);
    diff -= mm  * 60;
    var ss = Math.floor(diff);
    return zeroPrefix(hh) + ":" + zeroPrefix(mm) + ":" + zeroPrefix(ss);
  }
}