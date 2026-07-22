/* Pizzon Chatbot JS */
(function(){
	var EMAILJS_SERVICE  = 'YOUR_SERVICE_ID';
	var EMAILJS_TEMPLATE = 'YOUR_TEMPLATE_ID';
	var EMAILJS_KEY      = 'YOUR_PUBLIC_KEY';
	var OWNER_EMAIL      = 'harthikgokul@gmail.com';

	var btn    = document.getElementById('pz-cb-btn');
	var win    = document.getElementById('pz-cb-win');
	var msgs   = document.getElementById('pz-msgs');
	var chips  = document.getElementById('pz-chips');
	var inp    = document.getElementById('pz-inp');
	var snd    = document.getElementById('pz-snd');

	var step   = 'idle';
	var data   = {name:'', email:'', phone:'', intent:''};
	var ready  = false;

	/* toggle */
	btn.addEventListener('click', function(){
		var o = win.classList.toggle('open');
		btn.classList.toggle('open', o);
		btn.innerHTML = o ? '&#x2715;' : '&#x1F4AC;';
		if(o && !ready){ ready=true; startChat(); }
	});

	/* add bubble */
	function addMsg(html, who){
		var row = document.createElement('div');
		row.className = 'pz-row ' + who;
		if(who==='bot'){
			row.innerHTML = '<div class="pz-av">&#x1F916;</div><div class="pz-bub">' + html + '</div>';
		} else {
			row.innerHTML = '<div class="pz-bub">' + html + '</div>';
		}
		msgs.appendChild(row);
		msgs.scrollTop = msgs.scrollHeight;
	}

	/* typing indicator */
	function showTyping(){
		var row = document.createElement('div');
		row.className = 'pz-row bot';
		row.id = 'pz-typing';
		row.innerHTML = '<div class="pz-av">&#x1F916;</div><div class="pz-bub"><div class="pz-dots"><span></span><span></span><span></span></div></div>';
		msgs.appendChild(row);
		msgs.scrollTop = msgs.scrollHeight;
	}
	function hideTyping(){
		var t = document.getElementById('pz-typing');
		if(t) t.remove();
	}

	/* delayed bot reply */
	function botSay(html, delay, quickChips){
		delay = delay || 750;
		showTyping();
		setTimeout(function(){
			hideTyping();
			addMsg(html, 'bot');
			if(quickChips) setChips(quickChips);
		}, delay);
	}

	/* quick reply chips */
	function setChips(list){
		chips.innerHTML = '';
		list.forEach(function(label){
			var c = document.createElement('button');
			c.className = 'pz-chip';
			c.textContent = label;
			c.addEventListener('click', function(){
				chips.innerHTML = '';
				handleMsg(label);
			});
			chips.appendChild(c);
		});
	}

	/* start */
	function startChat(){
		step = 'idle';
		data = {name:'', email:'', phone:'', intent:''};
		setTimeout(function(){
			addMsg('&#x1F44B; Hi there! How can I help you today?', 'bot');
			setTimeout(function(){
				setChips(['&#x1F4C5; Book a Table','&#x1F355; View Menu','&#x1F4DE; Contact Us','&#x23F0; Opening Hours']);
			}, 400);
		}, 300);
	}

	/* handle message */
	function handleMsg(text){
		addMsg(text, 'usr');
		chips.innerHTML = '';
		var lo = text.toLowerCase();

		/* contact info collection flow */
		if(step==='name'){
			if(text.trim().length < 2){ botSay('Please enter a valid name &#x1F642;'); return; }
			data.name = text.trim();
			step = 'email';
			botSay('Nice to meet you, <b>' + data.name + '</b>! &#x1F60A;<br>What is your <b>email address</b>?');
			return;
		}
		if(step==='email'){
			if(!text.includes('@') || !text.includes('.')){
				botSay('That does not look like a valid email. Please try again &#x1F4E7;');
				return;
			}
			data.email = text.trim();
			step = 'phone';
			botSay('Got it! Now your <b>phone number</b> please? &#x1F4F1;');
			return;
		}
		if(step==='phone'){
			data.phone = text.trim();
			step = 'done';
			sendLead();
			return;
		}

		/* menu */
		if(lo.includes('book') || lo.includes('table') || lo.includes('reserv')){
			data.intent = 'Book a Table';
			step = 'name';
			botSay('Great! I can help with that &#x1F37D;&#xFE0F;<br>First, may I know your <b>name</b>?');
		} else if(lo.includes('menu') || lo.includes('pizza') || lo.includes('food') || lo.includes('view menu')){
			botSay('We have amazing Pizzas, Pasta, Slides and Special Offers! &#x1F355;<br>Check the <b>Our Menu</b> section above.', 800,
				['&#x1F4C5; Book a Table','&#x1F4DE; Contact Us']);
		} else if(lo.includes('contact') || lo.includes('call') || lo.includes('reach')){
			data.intent = 'Contact Request';
			step = 'name';
			botSay('Sure! I will get our team to reach you. &#x1F4DE;<br>May I have your <b>name</b>?');
		} else if(lo.includes('hour') || lo.includes('open') || lo.includes('time') || lo.includes('close')){
			botSay('&#x23F0; We are open:<br><b>Mon&#x2013;Fri:</b> 11:00 AM &#x2013; 11:00 PM<br><b>Sat&#x2013;Sun:</b> 10:00 AM &#x2013; 12:00 AM', 800,
				['&#x1F4C5; Book a Table','&#x1F355; View Menu','&#x1F4DE; Contact Us']);
		} else if(lo.includes('hi') || lo.includes('hello') || lo.includes('hey')){
			botSay('Hello! &#x1F44B; How can I help you today?', 600,
				['&#x1F4C5; Book a Table','&#x1F355; View Menu','&#x1F4DE; Contact Us','&#x23F0; Opening Hours']);
		} else if(lo.includes('thank') || lo.includes('bye') || lo.includes('ok')){
			botSay('You are welcome! &#x1F60A; Have a delicious day! &#x1F355;');
		 } else {
			botSay('I can help you with:', 700,
				['&#x1F4C5; Book a Table','&#x1F355; View Menu','&#x1F4DE; Contact Us','&#x23F0; Opening Hours']);
		}
	}

	/* send lead to email */
	function sendLead(){
		botSay('Sending your details to our team&#x2026; &#x23F3;');
		var success = '<b>Done!</b> Our team will contact you at <b>' + data.email + '</b> soon. Thank you, <b>' + data.name + '</b>! &#x1F389;';
		var fail    = 'Sorry, something went wrong. Please call us directly or use the contact form.';

		if(typeof emailjs !== 'undefined' && EMAILJS_SERVICE !== 'YOUR_SERVICE_ID'){
			emailjs.init({ publicKey: EMAILJS_KEY });
			emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, {
				cb_name:    data.name,
				cb_email:   data.email,
				cb_phone:   data.phone,
				cb_message: data.intent,
				to_email:   OWNER_EMAIL
			}).then(function(){
				botSay('&#x2705; ' + success, 1200, ['&#x1F4C5; Book a Table','&#x1F355; View Menu']);
			}).catch(function(){
				botSay('&#x274C; ' + fail, 1200);
			});
		} else {
			/* EmailJS not configured — still show confirmation */
			setTimeout(function(){
				hideTyping();
				addMsg('&#x2705; ' + success, 'bot');
				setChips(['&#x1F4C5; Book a Table','&#x1F355; View Menu']);
			}, 1200);
		}
	}

	/* send button + enter key */
	function doSend(){
		var t = inp.value.trim();
		if(!t) return;
		inp.value = '';
		handleMsg(t);
	}
	snd.addEventListener('click', doSend);
	inp.addEventListener('keydown', function(e){ if(e.key==='Enter') doSend(); });

})();
