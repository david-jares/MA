function createSlider(inputId, sliderId, min, max, step, onChange) {
    var slider = document.getElementById(sliderId);
    var input = document.getElementById(inputId);
    input.value = slider.value;
    slider.oninput = function() {
      input.value = this.value;
      onChange();
    };
    input.oninput = function() {
      if (this.value < min) {
        this.value = min;
      } else if (this.value > max) {
        this.value = max;
      }
      slider.value = this.value;
      onChange();
    };
  }
