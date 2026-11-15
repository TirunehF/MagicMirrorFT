/* global Cron */

Module.register("compliments", {
	// Module config defaults.
	defaults: {
		compliments: {
			anytime: [
				"Do the next useful thing.",
				"Small progress still compounds.",
				"Start before you feel ready.",
				"What you repeat becomes your life.",
				"A plan that fits reality beats a perfect one.",
				"Attention is a budget. Spend it on purpose.",
				"Protect your energy before protecting your image.",
				"Confusion is often unmade decisions.",
				"Make it obvious or it won't happen.",
				"You can restart this hour.",
				"The bottleneck usually has a name.",
				"If it matters, schedule it.",
				"Momentum likes small beginnings.",
				"Discipline is easier than regret.",
				"Most drift starts with one exception.",
				"Finish one thing before opening three more.",
				"Boring work builds interesting lives.",
				"Don't negotiate with obvious distractions.",
				"Your standards are what you repeat.",
				"Slow is fine. Stuck is not.",
				"You don't need a new system today.",
				"Clear beats intense.",
				"The next step is enough.",
				"Mood follows motion more often than thought.",
				"Ambition is good. Water first.",
				"Reduce friction, then add effort.",
				"Delay the impulse, not the goal.",
				"What are you avoiding right now?",
				"Make today easier for tomorrow-you.",
				"A reset is productive.",
				"Don't confuse research with progress.",
				"Fewer tabs. Better thinking.",
				"The first draft is allowed to be ugly.",
				"Protect the hours that protect your future.",
				"Consistency survives motivation.",
				"Rest on purpose, not by accident.",
				"If you say yes, decide what becomes no.",
				"Urgency is not always importance.",
				"Practice being reliable to yourself.",
				"The day improves when the next action is clear.",
				"Courage often looks like starting badly.",
				"Leave some room in the plan.",
				"Most problems shrink after ten focused minutes.",
				"You can be kind and still have boundaries.",
				"Build a life you do not need to escape from.",
				"Done today beats ideal someday.",
				"Check the facts before the mood.",
				"Friction reveals the real habit.",
				"Progress can look boring from the inside.",
				"Keep going, but not mindlessly."
			],
			morning: [
				"Protect your first hour.",
				"Start with the hardest useful thing.",
				"Today does not need to be perfect to be good.",
				"Begin before the noise begins.",
				"One focused block can change the day.",
				"Decide your top priority before messages.",
				"Win the morning by removing one distraction.",
				"Start smaller than your ambition wants.",
				"Energy first, then intensity.",
				"Breathe, then move.",
				"Don't scroll your focus away.",
				"Set the pace before the day sets it for you.",
				"What would make today a real win?",
				"Start where your feet are.",
				"Make the next step obvious.",
				"Mood can catch up later.",
				"Do not outsource your morning to notifications.",
				"Clarity is a better start than hype.",
				"Begin with movement, not hesitation.",
				"Pick one thing worth finishing.",
				"You are allowed to start messy.",
				"Open the task before opening opinions.",
				"Quiet work beats loud intentions.",
				"A good morning starts the night before, but start anyway.",
				"Show up before motivation makes a speech.",
				"Do the task you keep mentally rehearsing.",
				"Check your calendar, then your phone.",
				"Protect momentum from tiny leaks.",
				"Use fresh energy on real work.",
				"Start now; improve later.",
				"Let your schedule prove your priorities.",
				"One decision early saves ten later.",
				"Choose direction before speed.",
				"The first hour is expensive. Spend it well.",
				"Focus is easier before consumption.",
				"Make the first action physical: stand up, water, begin.",
				"You do not need to feel inspired to be effective.",
				"Build trust with yourself this morning.",
				"Start with reality, not fantasy planning.",
				"Make progress visible before noon.",
				"Friction in the morning echoes all day.",
				"If it matters, touch it early.",
				"Your future likes early starts.",
				"Do the obvious healthy thing first.",
				"Begin calmly, not passively.",
				"Today is built from the first few choices.",
				"Less rushing, more intention.",
				"Start with what moves the needle.",
				"A short start beats a delayed perfect start.",
				"Wake up and choose your day on purpose."
			],
			afternoon: [
				"Halfway through is a good time to reset.",
				"Check your pace, not just your effort.",
				"What is the bottleneck right now?",
				"Finish one thing before switching.",
				"A short walk can save a wasted hour.",
				"Re-prioritize before you push harder.",
				"Protect the next two hours.",
				"Midday drift is normal. Redirect.",
				"Do the next clear task.",
				"Eat, hydrate, then decide.",
				"Tired is not the same as done.",
				"Trim the plan; keep the goal.",
				"Which task is creating the most background stress?",
				"You can recover the day from here.",
				"Close a loop.",
				"Progress likes fewer open tabs.",
				"Return to the task, not the mood.",
				"Make one decision you've been delaying.",
				"A reset is not a retreat.",
				"Stop polishing what is already enough.",
				"If you're scattered, write the next three steps.",
				"Guard your attention from random urgency.",
				"This hour still counts.",
				"Be precise about what needs finishing.",
				"Energy dip? Lower complexity, not standards.",
				"Don't let a slow patch become a lost day.",
				"Finish the thing that will make evening lighter.",
				"Choose completion over novelty.",
				"Work in rounds, not endless blur.",
				"Most spirals break with one completed action.",
				"Refill your water before your excuses.",
				"Ask: what would make this afternoon successful?",
				"Keep the promise you made this morning.",
				"If the plan broke, adapt, don't quit.",
				"Clear the smallest annoying task first.",
				"Protect focus after lunch.",
				"You do not need to catch up all at once.",
				"One strong hour beats four distracted ones.",
				"Reduce decisions; increase action.",
				"Check posture, breathing, and priorities.",
				"The day is not ruined because the morning was messy.",
				"Continue with intention, not autopilot.",
				"Replace urgency theater with useful work.",
				"Pause, sort, proceed.",
				"Your attention deserves better than doom-scroll breaks.",
				"Get back to the main thing.",
				"Leave multitasking to computers.",
				"A calm reset can outperform a panic sprint.",
				"Afternoon discipline makes evening easier.",
				"Keep going, but choose wisely."
			],
			evening: [
				"Close the day on purpose.",
				"What moved you forward today?",
				"Small wins still count.",
				"Rest is part of the work.",
				"End the day with fewer open loops.",
				"What should be easier tomorrow because of today?",
				"A rough day can still end well.",
				"Review without attacking yourself.",
				"Capture the lesson, release the drama.",
				"You do not need to solve everything tonight.",
				"Finish with order, not chaos.",
				"Put tomorrow's first task in sight.",
				"The day was real even if it wasn't perfect.",
				"Recovery is productive.",
				"Stop when the work quality drops, not only when the clock says so.",
				"Gratitude and honesty can share the same page.",
				"Did you protect what matters, even a little?",
				"Progress can be quiet.",
				"Let the evening reduce noise.",
				"Decide what you're done carrying tonight.",
				"Write it down so your brain can rest.",
				"The best late-night plan is often sleep.",
				"Close screens before they close your focus.",
				"One reflection beats ten vague worries.",
				"Be proud of the effort, then improve the method.",
				"Reset your space, reset your mind.",
				"What drained you? What restored you?",
				"End with clarity, not scrolling.",
				"Tomorrow starts with tonight's choices.",
				"Leave a small gift for morning-you.",
				"Not every unfinished thing is a failure.",
				"Notice what worked.",
				"Release the performance, keep the learning.",
				"Rested you is more capable than guilty you.",
				"Evening is for landing, not spiraling.",
				"If today was heavy, make tonight lighter.",
				"A calm finish is a real achievement.",
				"Prepare, then unplug.",
				"You can end late, but end deliberately.",
				"What deserves a repeat tomorrow?",
				"Protect sleep like an appointment.",
				"The day ends better when you stop narrating it as a verdict.",
				"Close one loop and call it progress.",
				"Less self-judgment, more course correction.",
				"Let enough be enough for today.",
				"The goal tonight is recovery with intention.",
				"Shut down the day, not just the laptop.",
				"Be kind, be honest, sleep.",
				"Another chance is built overnight.",
				"End the day like someone you trust."
			],
			"....-01-01": ["Happy new year!"]
		},
		updateInterval: 30000,
		remoteFile: null,
		remoteFileRefreshInterval: 0,
		fadeSpeed: 4000,
		morningStartTime: 3,
		morningEndTime: 12,
		afternoonStartTime: 12,
		afternoonEndTime: 17,
		random: true,
		specialDayUnique: false
	},
	compliments_new: null,
	refreshMinimumDelay: 15 * 60 * 1000, // 15 minutes
	lastIndexUsed: -1,
	// Set currentweather from module
	currentWeatherType: "",
	cron_regex: /^(((\d+,)+\d+|((\d+|[*])[/]\d+|((JAN|FEB|APR|MA[RY]|JU[LN]|AUG|SEP|OCT|NOV|DEC)(-(JAN|FEB|APR|MA[RY]|JU[LN]|AUG|SEP|OCT|NOV|DEC))?))|(\d+-\d+)|\d+(-\d+)?[/]\d+(-\d+)?|\d+|[*]|(MON|TUE|WED|THU|FRI|SAT|SUN)(-(MON|TUE|WED|THU|FRI|SAT|SUN))?) ?){5}$/i,
	date_regex: "[1-9.][0-9.][0-9.]{2}-([0][1-9]|[1][0-2])-([1-2][0-9]|[0][1-9]|[3][0-1])",
	pre_defined_types: ["anytime", "morning", "afternoon", "evening"],
	// Define required scripts.
	getScripts () {
		return ["croner.js", "moment.js"];
	},

	// Define start sequence.
	async start () {
		Log.info(`Starting module: ${this.name}`);

		this.lastComplimentIndex = -1;

		if (this.config.remoteFile !== null) {
			const response = await this.loadComplimentFile();
			this.config.compliments = JSON.parse(response);
			this.updateDom();
			if (this.config.remoteFileRefreshInterval !== 0) {
				if ((this.config.remoteFileRefreshInterval >= this.refreshMinimumDelay) || window.mmTestMode === "true") {
					setInterval(async () => {
						const response = await this.loadComplimentFile();
						if (response) {
							this.compliments_new = JSON.parse(response);
						}
						else {
							Log.error(`[compliments] ${this.name} remoteFile refresh failed`);
						}
					},
					this.config.remoteFileRefreshInterval);
				} else {
					Log.error(`[compliments] ${this.name} remoteFileRefreshInterval less than minimum`);
				}
			}
		}
		let minute_sync_delay = 1;
		// loop thru all the configured when events
		for (let m of Object.keys(this.config.compliments)) {
			// if it is a cron entry
			if (this.isCronEntry(m)) {
				// we need to synch our interval cycle to the minute
				minute_sync_delay = (60 - (moment().second())) * 1000;
				break;
			}
		}
		// Schedule update timer. sync to the minute start (if needed), so minute based events happen on the minute start
		setTimeout(() => {
			setInterval(() => {
				this.updateDom(this.config.fadeSpeed);
			}, this.config.updateInterval);
		},
		minute_sync_delay);
	},

	// check to see if this entry could be a cron entry which contains spaces
	isCronEntry (entry) {
		return entry.includes(" ");
	},

	/**
	 * @param {string} cronExpression The cron expression. See https://croner.56k.guru/usage/pattern/
	 * @param {Date} [timestamp] The timestamp to check. Defaults to the current time.
	 * @returns {number} The number of seconds until the next cron run.
	 */
	getSecondsUntilNextCronRun (cronExpression, timestamp = new Date()) {
		// Required for seconds precision
		const adjustedTimestamp = new Date(timestamp.getTime() - 1000);

		// https://www.npmjs.com/package/croner
		const cronJob = new Cron(cronExpression);
		const nextRunTime = cronJob.nextRun(adjustedTimestamp);

		const secondsDelta = (nextRunTime - adjustedTimestamp) / 1000;
		return secondsDelta;
	},

	/**
	 * Generate a random index for a list of compliments.
	 * @param {string[]} compliments Array with compliments.
	 * @returns {number} a random index of given array
	 */
	randomIndex (compliments) {
		if (compliments.length <= 1) {
			return 0;
		}

		const generate = function () {
			return Math.floor(Math.random() * compliments.length);
		};

		let complimentIndex = generate();

		while (complimentIndex === this.lastComplimentIndex) {
			complimentIndex = generate();
		}

		this.lastComplimentIndex = complimentIndex;

		return complimentIndex;
	},

	/**
	 * Retrieve an array of compliments for the time of the day.
	 * @returns {string[]} array with compliments for the time of the day.
	 */
	complimentArray () {
		const now = moment();
		const hour = now.hour();
		const date = now.format("YYYY-MM-DD");
		let compliments = [];

		// Add time of day compliments
		let timeOfDay;
		if (hour >= this.config.morningStartTime && hour < this.config.morningEndTime) {
			timeOfDay = "morning";
		} else if (hour >= this.config.afternoonStartTime && hour < this.config.afternoonEndTime) {
			timeOfDay = "afternoon";
		} else {
			timeOfDay = "evening";
		}

		if (timeOfDay && this.config.compliments.hasOwnProperty(timeOfDay)) {
			compliments = [...this.config.compliments[timeOfDay]];
		}

		// Add compliments based on weather
		if (this.currentWeatherType in this.config.compliments) {
			Array.prototype.push.apply(compliments, this.config.compliments[this.currentWeatherType]);
			// if the predefine list doesn't include it (yet)
			if (!this.pre_defined_types.includes(this.currentWeatherType)) {
				// add it
				this.pre_defined_types.push(this.currentWeatherType);
			}
		}

		// Add compliments for anytime
		Array.prototype.push.apply(compliments, this.config.compliments.anytime);

		// get the list of just date entry keys
		let temp_list = Object.keys(this.config.compliments).filter((k) => {
			if (this.pre_defined_types.includes(k)) return false;
			else return true;
		});

		let date_compliments = [];
		// Add compliments for special day/times
		for (let entry of temp_list) {
			// check if this could be a cron type entry
			if (this.isCronEntry(entry)) {
				// make sure the regex is valid
				if (new RegExp(this.cron_regex).test(entry)) {
					// check if we are in the time range for the cron entry
					if (this.getSecondsUntilNextCronRun(entry, now.set("seconds", 0).toDate()) <= 1) {
						// if so, use its notice entries
						Array.prototype.push.apply(date_compliments, this.config.compliments[entry]);
					}
				} else Log.error(`[compliments] cron syntax invalid=${JSON.stringify(entry)}`);
			} else if (new RegExp(entry).test(date)) {
				Array.prototype.push.apply(date_compliments, this.config.compliments[entry]);
			}
		}

		// if we found any date compliments
		if (date_compliments.length) {
			// and the special flag is true
			if (this.config.specialDayUnique) {
				// clear the non-date compliments if any
				compliments.length = 0;
			}
			// put the date based compliments on the list
			Array.prototype.push.apply(compliments, date_compliments);
		}

		return compliments;
	},

	/**
	 * Retrieve a file from the local filesystem
	 * @returns {Promise<string|null>} Resolved with file content or null on error
	 */
	async loadComplimentFile () {
		const { remoteFile, remoteFileRefreshInterval } = this.config;
		const isRemote = remoteFile.startsWith("http://") || remoteFile.startsWith("https://");
		let url = isRemote ? remoteFile : this.file(remoteFile);

		try {
			// Validate URL
			const urlObj = new URL(url);
			// Add cache-busting parameter to remote URLs to prevent cached responses
			if (isRemote && remoteFileRefreshInterval !== 0) {
				urlObj.searchParams.set("dummy", Date.now());
			}
			url = urlObj.toString();
		} catch {
			Log.warn(`[compliments] Invalid URL: ${url}`);
		}

		try {
			const response = await fetch(url);
			if (!response.ok) {
				Log.error(`[compliments] HTTP error: ${response.status} ${response.statusText}`);
				return null;
			}
			return await response.text();
		} catch (error) {
			Log.info("[compliments] fetch failed:", error.message);
			return null;
		}
	},

	/**
	 * Retrieve a random compliment.
	 * @returns {string} a compliment
	 */
	getRandomCompliment () {
		// get the current time of day compliments list
		const compliments = this.complimentArray();
		// variable for index to next message to display
		let index;
		// are we randomizing
		if (this.config.random) {
			// yes
			index = this.randomIndex(compliments);
		} else {
			// no, sequential
			// if doing sequential, don't fall off the end
			index = this.lastIndexUsed >= compliments.length - 1 ? 0 : ++this.lastIndexUsed;
		}

		return compliments[index] || "";
	},

	// Override dom generator.
	getDom () {
		const wrapper = document.createElement("div");
		wrapper.className = this.config.classes ? this.config.classes : "thin xlarge bright pre-line";
		// get the compliment text
		const complimentText = this.getRandomCompliment();
		// split it into parts on newline text
		const parts = complimentText.split("\n");
		// create a span to hold the compliment
		const compliment = document.createElement("span");
		// process all the parts of the compliment text
		for (const part of parts) {
			if (part !== "") {
				// create a text element for each part
				compliment.appendChild(document.createTextNode(part));
				// add a break
				compliment.appendChild(document.createElement("BR"));
			}
		}
		// only add compliment to wrapper if there is actual text in there
		if (compliment.children.length > 0) {
			// remove the last break
			compliment.lastElementChild.remove();
			wrapper.appendChild(compliment);
		}
		// if a new set of compliments was loaded from the refresh task
		// we do this here to make sure no other function is using the compliments list
		if (this.compliments_new) {
			// use them
			if (JSON.stringify(this.config.compliments) !== JSON.stringify(this.compliments_new)) {
				// only reset if the contents changes
				this.config.compliments = this.compliments_new;
				// reset the index
				this.lastIndexUsed = -1;
			}
			// clear new file list so we don't waste cycles comparing between refreshes
			this.compliments_new = null;
		}
		// only in test mode
		if (window.mmTestMode === "true") {
			// check for (undocumented) remoteFile2 to test new file load
			if (this.config.remoteFile2 !== null && this.config.remoteFileRefreshInterval !== 0) {
				// switch the file so that next time it will be loaded from a changed file
				this.config.remoteFile = this.config.remoteFile2;
			}
		}
		return wrapper;
	},

	// Override notification handler.
	notificationReceived (notification, payload, sender) {
		if (notification === "CURRENTWEATHER_TYPE") {
			this.currentWeatherType = payload.type;
		}
	}
});
