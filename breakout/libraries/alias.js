function Alias(probs) {

	this.init = function(probs) {
		probs = probs.map(function(v) { return v * probs.length; });

		this.probability = [];
		this.alias = [];

		var small = [];
		var large = [];

		for(var i = 0; i < probs.length; i++) {
			probs[i] >= 1 ? large.push(i) : small.push(i);
		}

		while(small.length > 0 && large.length > 0) {
			var l = small.shift();
			var g = large.shift();

			this.probability[l] = probs[l];
			this.alias[l] = g;

			probs[g] = (probs[g] + probs[l]) - 1;
			probs[g] >= 1 ? large.push(g) : small.push(g);

		}

		while(large.length > 0) {
			this.probability[large.shift()] = 1;
		}

		while(small.length > 0) {
			this.probability[small.shift()] = 1;
		}
	}

	this.init(probs);

	this.next = function() {
		var i = Math.floor(random(0, this.probability.length));
		return Math.random() < this.probability[i] ? i : this.alias[i];
	}

}

//
