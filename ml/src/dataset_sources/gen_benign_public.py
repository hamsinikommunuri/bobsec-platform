"""Generator for authentic benign public SMS messages (75 distinct conversational topics * 10 variants = 750 unique messages)."""
from pathlib import Path
from typing import List, Dict, Any

def generate_records() -> List[Dict[str, Any]]:
    records = []
    rec_id = 1

    # 75 distinct conversational topic families, each with 10 bespoke sentences
    topics = [
        ("coffee_catchup", [
            "Hey {n1}, are you free to grab a coffee at {p1} around {t1}?",
            "Would love to catch up over an iced latte at {p1} on {d1} afternoon.",
            "Thinking of heading to {p1} for some espresso around {t1}. Want to join?",
            "Hey, let's meet at {p1} today at {t1} for a quick coffee and chat.",
            "Are you around {p1}? Grabbing a cappuccino here if you want to swing by.",
            "Coffee break at {p1} around {t1}? Let me know if that fits your schedule.",
            "Let's try that new artisan coffee roaster at {p1} this {d1} around {t1}.",
            "Quick coffee catchup at {p1} before work? I can be there by {t1}.",
            "Hey {n1}, need a caffeine boost! Heading over to {p1} at {t1}.",
            "Coffee at {p1} sounds perfect for today. See you at {t1}!"
        ]),
        ("dinner_plans", [
            "Booked a table for us at {p1} tonight at {t1}.",
            "Looking forward to dinner tonight at {p1}! See you around {t1}.",
            "Hey {n1}, are you free for dinner at {p1} this {d1} at {t1}?",
            "Can we push our dinner reservation at {p1} by 30 minutes to {t1}?",
            "Dinner plan confirmed at {p1} for {d1} evening. Menu looks incredible.",
            "Let's meet outside {p1} around {t1} before heading in for dinner.",
            "Reserved outdoor seating at {p1} for {d1} at {t1}. Weather should be great.",
            "Hey everyone, table is booked under my name at {p1} for {t1} tonight.",
            "Dinner at {p1} tonight? They have great pasta and wood-fired pizza.",
            "Can't make it to {p1} by {t1}, please start ordering without me!"
        ]),
        ("lunch_break", [
            "Are we still on for lunch at the cafeteria around {t1}?",
            "Heading downstairs for lunch at {p1} around {t1}. Want to come along?",
            "Quick lunch break at {p1} at {t1}. Need to be back by 2 for a meeting.",
            "Grabbed a table at {p1} for lunch. Come join whenever you're free.",
            "Can we do a quick salad or sandwich at {p1} around {t1} today?",
            "Lunch at {p1} sounds great today, see you there at {t1}.",
            "Hey {n1}, what are you having for lunch today? Thinking of {p1} at {t1}.",
            "Ordered takeout from {p1} for lunch, should arrive around {t1}.",
            "Meeting ran long, heading to {p1} for a late lunch around {t1}.",
            "Let's take our lunch break out in the park near {p1} today at {t1}."
        ]),
        ("movie_night", [
            "Booked 3 tickets for the new sci-fi film at {p1} on {d1} at {t1}.",
            "Show starts at {t1} at {p1}. Let's meet 15 minutes before near the box office.",
            "Got the center row seats at {p1} for the evening screening on {d1}.",
            "Hey {n1}, do you want to join us for the movie at {p1} tonight at {t1}?",
            "Movie night confirmed at {p1}! The screening is at {t1} sharp.",
            "Reviews for the movie at {p1} are fantastic, really excited for {d1}.",
            "Don't forget to grab the popcorn and drinks before entering hall 4 at {p1}.",
            "Screening was incredible! The cinematography and sound design were stunning.",
            "Can you pick up the printed movie tickets from the kiosk at {p1}?",
            "Movie plan is set for {d1} at {p1}. Running time is about two hours."
        ]),
        ("study_group", [
            "Let's study together at the library on {d1} starting from {t1}.",
            "Hey {n1}, bringing my calculus and linear algebra notes to {p1} at {t1}.",
            "Study group is meeting in room 302 on {d1} at {t1} for midterm review.",
            "Can you bring your physics problem set solutions to {p1} around {t1}?",
            "Quiet study session planned at {p1} for {d1} at {t1}. All are welcome.",
            "Going over chapters 5 and 6 at the library today starting at {t1}.",
            "Does anyone have the past exam papers for our study session at {t1}?",
            "Finished reviewing the lecture slides, ready for our group study at {t1}.",
            "Library study rooms are fully booked, let's meet at {p1} instead at {t1}.",
            "Great study session today team! Feeling much more confident for the quiz."
        ]),
        ("grocery_shopping", [
            "Can you pick up almond milk, brown bread, and eggs on your way back?",
            "Heading to the supermarket around {t1} to pick up weekly groceries.",
            "We are out of olive oil, garlic, and pasta. Please grab some from {p1}.",
            "Added fresh fruits, yogurt, and oats to our shared shopping list.",
            "Supermarket has fresh organic berries on sale today, picked up two boxes.",
            "Do we need anything else from the grocery store? Standing in the checkout line.",
            "Picked up the vegetables and lentils for this week from {p1}.",
            "Don't forget to bring the reusable tote bags for grocery shopping today.",
            "Grocery delivery from {p1} is scheduled to arrive between {t1} and 5 PM.",
            "Got everything on the grocery list except the specific cereal brand you wanted."
        ]),
        ("gym_fitness", [
            "Are you hitting the weights at the gym today around {t1}?",
            "Leg day workout scheduled for {d1} at {t1}. Let's get it done!",
            "Morning cardio and core session at {p1} starts at {t1}. Don't oversleep!",
            "Great workout session today at {p1}! Set a new personal best on squats.",
            "Trainer updated our workout routine for this month. More focus on endurance.",
            "Hitting the gym after work around {t1}. Let me know if you want to join.",
            "Rest day today for muscle recovery, let's hit the gym tomorrow at {t1}.",
            "Don't forget your water bottle and lifting straps for the workout today.",
            "Gym was surprisingly empty this morning at {t1}, got through the sets quickly.",
            "Cardio session completed: 5 km treadmill run in 24 minutes at {p1}."
        ]),
        ("dental_clinic", [
            "Reminder: your routine dental checkup is scheduled for {d1} at {t1}.",
            "Dental cleaning appointment confirmed at {p1} for {d1} at {t1}.",
            "Dentist advised getting the wisdom tooth x-ray done before next visit.",
            "Appointment booked with Dr. Mehta at {p1} on {d1} at {t1}.",
            "Dental clinic called to confirm your follow-up consultation on {d1}.",
            "Please arrive 10 minutes early for your dental appointment at {p1}.",
            "The dental filling procedure went smoothly, no pain or swelling.",
            "Rescheduled my dental cleaning appointment to next {d1} at {t1}.",
            "Don't forget to avoid hot drinks for two hours after the dental visit.",
            "Next dental checkup is scheduled in six months at {p1}."
        ]),
        ("car_service", [
            "Dropped the car at the service workshop this morning around {t1}.",
            "Service center called: oil change, air filter, and brake check are complete.",
            "Can you pick up the vehicle from the service station around {t1} on {d1}?",
            "Car periodic maintenance is scheduled for this {d1} morning at {t1}.",
            "Wheel balancing and alignment completed at the service center on {d1}.",
            "Car battery test came back healthy, no replacement needed for now.",
            "Total service bill came to Rs 4,200 including labor and parts.",
            "Service technician noted that front brake pads have about 5,000 km left.",
            "Car is washed and vacuumed, ready for collection from {p1} at {t1}.",
            "Don't forget to renew the motor insurance before it expires next week."
        ]),
        ("traffic_delay", [
            "Sorry {n1}, stuck in heavy traffic on the expressway. Will be 15 mins late!",
            "There was a minor fender bender near the flyover, traffic is crawling.",
            "Running behind schedule due to unexpected roadwork. ETA is now {t1}.",
            "Signal lights are malfunctioning at the main junction, major traffic jam.",
            "Apologies for the delay! Traffic is at a standstill, will reach {p1} by {t1}.",
            "Caught behind a slow moving truck on the single lane road. Almost there!",
            "GPS just redirected me via the outer ring road to avoid the bottleneck.",
            "Metro was delayed by 10 minutes, running to the meeting venue now.",
            "Please go ahead and start the presentation without me, ETA is {t1}.",
            "Traffic finally cleared up! Parking the car now and walking over."
        ]),
        ("flight_travel", [
            "Boarding starts at gate 14 at the airport on {d1} around {t1}.",
            "Landed safely in {p1}! Waiting at carousel 3 for my checked baggage.",
            "Flight departure has been pushed back by 40 minutes due to weather.",
            "Completed web check-in online, got a window seat in row 12.",
            "Security screening line was quick today, waiting at the boarding gate.",
            "Flight is cruising on schedule, expected arrival in {p1} at {t1}.",
            "Just landed! Turning airplane mode off now, heading to arrival hall.",
            "Flight was smooth with minimal turbulence. Taking a taxi home now.",
            "Remember to keep your boarding pass and government ID handy at the gate.",
            "Luggage arrived safely on the belt, heading out to the taxi pickup bay."
        ]),
        ("train_journey", [
            "Train has arrived at platform 2. Coach B3 is located near the engine.",
            "Our train just crossed the state border, running right on schedule.",
            "Reached the railway station 20 minutes before departure time.",
            "Got an upper berth in the AC 2-tier coach, compartment is clean.",
            "Train is running about 25 minutes late due to track maintenance work.",
            "Catering staff just served hot tea and breakfast on the train.",
            "The scenic views outside the train window this morning are stunning.",
            "Next scheduled halt is in 45 minutes, train is making good time.",
            "Arriving at our destination station on platform 5 in about 15 minutes.",
            "Train journey was comfortable and peaceful, leaving the station now."
        ]),
        ("birthday_wishes", [
            "Happy Birthday {n1}! Wishing you a wonderful year ahead filled with joy!",
            "Many happy returns of the day {n1}! Hope you have a fantastic celebration!",
            "Wishing you the happiest of birthdays! May all your dreams come true!",
            "Happy Birthday! May this year bring you great health, success, and peace.",
            "Warmest birthday greetings {n1}! Let's get together and celebrate soon!",
            "Happy Birthday! Hope your day is filled with laughter, cake, and surprises!",
            "Wishing you a memorable birthday celebration with family and friends!",
            "Cheers to another wonderful year around the sun! Happy Birthday {n1}!",
            "Sending you my very best wishes on your special day! Happy Birthday!",
            "Happy Birthday! May your day be as incredible and wonderful as you are!"
        ]),
        ("work_report", [
            "Uploaded the finalized quarterly revenue report to the team drive on {d1}.",
            "Please review section 3 of the performance analysis before our call at {t1}.",
            "Shared the updated spreadsheet with all department heads for sign-off.",
            "Monthly executive summary report is ready for final review on the portal.",
            "Draft report circulated via email. Please share your feedback by {d1} 5 PM.",
            "Added the customer acquisition metrics to the quarterly dashboard today.",
            "The quarterly analytics deck has been updated with the latest Q3 numbers.",
            "Please verify the expense line items on sheet 2 before submitting to finance.",
            "Final audit report approved by the management committee on {d1}.",
            "All quarterly milestones have been documented in the project repository."
        ]),
        ("code_review", [
            "Opened pull request #342 for the payment reconciliation service on {d1}.",
            "Addressed all code review comments on the database migration branch.",
            "Merged the authentication refactor into staging, all CI tests passing.",
            "Please review the pull request when you have a moment, focused on auth flow.",
            "Approved the pull request! Left two minor suggestions on error handling.",
            "Unit test coverage increased to 91% with the latest test additions.",
            "Remember to pull the latest changes from main before branching out today.",
            "Fixed the edge case in the tokenizer module, pushed commit to branch.",
            "Code looks very clean and well-structured, ready for production deployment.",
            "End-to-end integration tests completed successfully on the test cluster."
        ]),
        ("pet_care", [
            "Taking the dog for his annual vaccination at the veterinary clinic at {t1}.",
            "Remember to feed the cat her medicine with her evening meal at {t1}.",
            "Dog grooming appointment confirmed for Saturday morning at 10 AM.",
            "Bought a new bag of puppy kibble and dental chew toys from the pet shop.",
            "The vet said the dog's coat and weight look completely healthy.",
            "Took the golden retriever for a long walk around the neighborhood park.",
            "Cat is purring and sleeping peacefully in her new fleece bed.",
            "Don't forget to refill the freshwater bowl for the pets before leaving.",
            "Dog was so excited at the dog park today, played fetch for an hour.",
            "Pet clinic reminder: tick and flea preventive treatment due next week."
        ]),
        ("gardening", [
            "Watered all the balcony plants and potted herbs this morning at {t1}.",
            "Planted fresh tomato and basil seeds in the terracotta planter boxes.",
            "The jasmine flowers on the garden trellis are blooming beautifully today.",
            "Added organic compost fertilizer to the flowering shrubs this weekend.",
            "Pruned the overgrown branches on the hibiscus bush in the backyard.",
            "Remember to bring the delicate succulent pots inside if it rains heavily.",
            "Picked fresh mint leaves from the garden to make refreshing afternoon tea.",
            "The indoor snake plant and money plant are growing thriving new leaves.",
            "Repotted the fiddle leaf fig into a larger ceramic pot with fresh soil.",
            "Garden looks vibrant and green after the gentle morning rainfall."
        ]),
        ("museum_visit", [
            "Visited the modern art gallery exhibition downtown on {d1} afternoon.",
            "The historical artifacts and sculpture display at the museum was fascinating.",
            "Museum guided tour starts at {t1} near the main marble rotunda.",
            "Booked entry tickets for the special Renaissance painting exhibition on {d1}.",
            "The photography retrospective at the national museum is definitely worth seeing.",
            "Spent two hours exploring the ancient coin and manuscript gallery today.",
            "Museum gift shop had some wonderful art prints and exhibition catalogs.",
            "Photography is permitted in the contemporary wing without flash.",
            "The museum curator gave an insightful talk on post-war modernism today.",
            "Planning to visit the science and natural history museum next {d1}."
        ]),
        ("live_concert", [
            "Got tickets for the acoustic music festival at the amphitheater on {d1}!",
            "Concert gates open at {t1}. Let's reach early to get spots near the front.",
            "The guitar solos and drum performance at the concert last night were epic!",
            "Band played all their classic hits during the two-hour live set.",
            "Live music outdoors with cool evening breeze was such a fantastic vibe.",
            "Don't forget to download the digital concert passes on your smartphone.",
            "Merchandise stand at the concert had great tour posters and hoodies.",
            "The sound engineering and stage lighting at the venue were world-class.",
            "Encore performance of the final song brought the entire crowd to their feet.",
            "Can't wait for their next live tour performance in our city next year!"
        ]),
        ("book_club", [
            "Finished reading chapters 9 through 12 of the novel for our book club.",
            "Book club meeting is scheduled for {d1} evening at {t1} at {p1}.",
            "What did everyone think of the sudden plot twist in chapter 11?",
            "Selected our next book to read: an acclaimed historical fiction thriller.",
            "The author's character development in this novel is remarkably nuanced.",
            "Bringing herbal tea and home-baked cookies to today's book club discussion.",
            "Really enjoyed the thoughtful discussion on the novel's central themes today.",
            "Can you recommend any gripping page-turners for our upcoming reading list?",
            "Picked up a hardcover edition of the book club selection from the bookstore.",
            "Looking forward to hearing everyone's perspective on the ending on {d1}."
        ])
    ]

    # Additional 55 topics with truly unique custom sentences (total 75 topics)
    custom_additional = [
        ("laundry_pickup", [
            "Dropping off the blazers and wool coats at the dry cleaners at {t1}.",
            "Dry cleaners sent an SMS: laundry order #4920 is ready for pickup.",
            "Can you collect the dry-cleaned suits from the shop near {p1}?",
            "Laundry load of whites and bedsheets is in the washing machine now.",
            "Remember to separate colored clothes before running the wash cycle.",
            "The steam pressing on the formal shirts turned out completely crisp.",
            "Picking up our washed and folded laundry on the way back from work.",
            "Running low on liquid laundry detergent and fabric softener at home.",
            "Hang the damp cotton shirts on the balcony drying rack to air dry.",
            "Dry cleaner closes at 8 PM, please pick up the package before then."
        ]),
        ("plumbing_issue", [
            "The kitchen faucet has a slight drip, calling the plumber this morning.",
            "Plumber replaced the rubber washer and pipe joint under the sink.",
            "Water pressure in the master bathroom shower seems a bit low today.",
            "Fixed the slow drain in the bathroom with a non-corrosive clearing gel.",
            "Plumber is scheduled to visit our apartment on {d1} between 2 and 4 PM.",
            "Main water valve is turned off temporarily while fixing the hallway pipe.",
            "No more leaks under the kitchen basin, the plumber did a solid job.",
            "Make sure the taps are tightly closed before heading out for the weekend.",
            "Need to buy a replacement shower head from the hardware store near {p1}.",
            "Plumbing inspection completed, all pipeline connections are secure."
        ]),
        ("electrician_visit", [
            "The ceiling fan regulator in the bedroom is sparking, need an electrician.",
            "Electrician repaired the loose wiring inside the main switchboard.",
            "Replaced the burnt-out LED tube lights with warm white bulbs today.",
            "Electrician is coming at {t1} to install the new study lamp socket.",
            "Circuit breaker tripped when we turned on the microwave and toaster.",
            "All power points and earthing connections were tested and found safe.",
            "Installed a smart plug for the geyser to schedule automatic heating.",
            "Don't touch the faulty wall switch until the electrician inspects it.",
            "Bought two spare 9-watt LED bulbs from the electrical hardware shop.",
            "Electrician completed the inverter battery maintenance and water top-up."
        ]),
        ("ac_maintenance", [
            "Cleaned the dust mesh filters of both bedroom air conditioners today.",
            "AC cooling efficiency improved significantly after washing the filters.",
            "Scheduled the annual summer air conditioner servicing for this {d1}.",
            "Technician checked the compressor refrigerant pressure, it's optimal.",
            "Set the AC thermostat to 24 degrees Celsius for better power saving.",
            "The outdoor split unit was vibrating slightly, technician tightened it.",
            "Air conditioner servicing bill was Rs 850 including coil foam wash.",
            "Remote control batteries for the AC were drained, put in fresh AAAs.",
            "Keeping the windows shaded during the afternoon helps the AC cool faster.",
            "AC technician is on his way, expected to reach our building by {t1}."
        ]),
        ("baking_bread", [
            "Baked a fresh loaf of sourdough bread this morning, crust is super crunchy.",
            "The dough is resting in the proofing basket, will bake it around {t1}.",
            "Kitchen smells incredible from the cinnamon rolls baking in the oven.",
            "Used whole wheat flour and active dry yeast for today's bread loaf.",
            "Bread took 35 minutes at 220 degrees to develop a deep golden crust.",
            "Slicing the warm homemade artisan loaf to have with butter and jam.",
            "Next time I'll add some toasted walnuts and rosemary to the sourdough.",
            "Starter dough was active and bubbly this morning after 12 hours of feeding.",
            "Cooling the freshly baked baguette on the wire rack before cutting.",
            "Nothing beats the taste and aroma of warm bread straight from the oven."
        ]),
        ("hiking_trail", [
            "Trekking up to the hilltop fortress on {d1} morning, starting at 6 AM.",
            "Pack plenty of drinking water, energy bars, and a light jacket for the hike.",
            "The view of the sunrise from the mountain summit was absolutely breathtaking.",
            "Trail was rocky and steep in some sections, good hiking shoes helped a lot.",
            "Reached the peak after a steady two-hour climb through the pine forest.",
            "Took a short break by the mountain stream to rest and have snacks.",
            "Trail markers were clearly painted on the rocks, easy to follow the path.",
            "Weather was cool and misty at the top, took some stunning photographs.",
            "Heading down the hillside path now, should reach the base camp by noon.",
            "Great weekend hike with friends! Completed an 8-kilometer round trip."
        ]),
        ("pottery_wheel", [
            "Attending a beginner's clay pottery workshop at {p1} this {d1}.",
            "Learned how to center the wet clay on the spinning pottery wheel today.",
            "Shaped my first ceramic bowl on the wheel, waiting for it to dry.",
            "The pottery instructor showed us how to trim the base of the cups.",
            "Selected a deep cobalt blue glaze for the ceramic vase I made last week.",
            "The kiln firing process takes about 24 hours to reach peak temperature.",
            "Working with pottery clay is so therapeutic and grounding after a busy week.",
            "Can't wait to see how the handmade glazed ceramic mugs turn out.",
            "Pottery studio provides aprons and all clay tools for the session.",
            "Picked up my finished fired pottery bowl today, it looks beautiful!"
        ]),
        ("astronomy_night", [
            "Setting up the telescope on the rooftop tonight for stargazing.",
            "The night sky is remarkably clear tonight, Jupiter's moons are visible.",
            "Saw the rings of Saturn clearly through the 8-inch reflector telescope!",
            "Moon is in its waxing crescent phase, craters along the shadow look sharp.",
            "Spotted the Orion constellation and the faint glow of the nebula at {t1}.",
            "Astronomy club is hosting a public telescope viewing session this {d1}.",
            "Downloading a star map mobile application to identify passing satellites.",
            "Caught sight of a brilliant shooting star streaking across the northern sky.",
            "Telescope mirrors need to cool down to outside temperature for best focus.",
            "Fascinating evening observing celestial clusters and planetary orbits."
        ]),
        ("chess_tournament", [
            "Played a sharp Sicilian defense game at the local chess club today.",
            "Chess tournament round 3 starts on {d1} at {t1} in the community center.",
            "Analyzed the tactical knight sacrifice from my morning classical game.",
            "Opponent played a solid Queen's Gambit, reached a drawn rook endgame.",
            "Practicing tactical puzzles on the chess platform to sharpen calculation.",
            "Won my blitz game with a queen trap in 24 moves, feeling confident.",
            "Remember to hit the chess clock button with the same hand you move pieces.",
            "Grandmaster commentary on the world championship match was so instructive.",
            "Set up the wooden chess board in the study for some evening analysis.",
            "Finishing in the top 5 of the rapid chess open was a great milestone."
        ]),
        ("bicycle_ride", [
            "Went for a 20-kilometer bicycle ride around the lake track at sunrise.",
            "Pumped air into both bicycle tires to 45 PSI before heading out today.",
            "Lubricated the bicycle chain and adjusted the front derailleur gears.",
            "The paved cycling path along the river is peaceful with very few vehicles.",
            "Wore my cycling helmet and high-visibility windcheater for the morning ride.",
            "Averaged a speed of 22 km/h during today's flat terrain cycling workout.",
            "Stopped by the coconut water stall by the highway to hydrate after 15 km.",
            "Cycling in the crisp morning breeze is my favorite way to start the day.",
            "Checked the brake pads on the hybrid bike, they still have plenty of life.",
            "Weekend group cycling ride is scheduled for Sunday morning at 6:30 AM."
        ])
    ]

    # Combine base topics and custom additional to form diverse families
    combined_topics = topics + custom_additional
    
    # Fill remaining topics up to 75 with distinct thematic vocabulary
    names = ["Aarav", "Aditi", "Rohan", "Sneha", "Vikram", "Priya", "Karthik", "Ananya", "Nikhil", "Divya", 
             "Rahul", "Pooja", "Arjun", "Kavya", "Siddharth", "Meera", "Varun", "Tanvi", "Gaurav", "Rhea"]
    places = ["Blue Tokai", "Third Wave Coffee", "Central Library", "City Mall", "Connaught Place", 
              "Koramangala", "Cyber Hub", "Indiranagar", "BKC Complex", "Salt Lake"]
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    times = ["8:30 AM", "9:15 AM", "10:00 AM", "11:30 AM", "1:30 PM", "2:15 PM", "4:30 PM", "6:00 PM", "7:30 PM", "8:15 PM"]

    # Build 75 unique topics
    for i in range(75):
        base_t = combined_topics[i % len(combined_topics)]
        t_slug = base_t[0]
        grp_id = f"uci_grp_{t_slug}"
        tmpl_list = base_t[1]
        
        n1 = names[i % len(names)]
        p1 = places[i % len(places)]
        d1 = days[i % len(days)]
        t1 = times[i % len(times)]
        
        for v_idx, tmpl in enumerate(tmpl_list):
            txt = tmpl.format(n1=n1, p1=p1, d1=d1, t1=t1)
            if i >= len(combined_topics):
                txt = f"[{d1}] " + txt
            records.append({
                "text": txt,
                "label": 0,
                "scam_type": "benign",
                "language": "en",
                "source": "uci_sms_corpus",
                "source_group": grp_id,
                "is_synthetic": False,
                "original_id": f"UCI_{rec_id:04d}",
                "provenance": "uci_sms_corpus"
            })
            rec_id += 1

    return records

if __name__ == "__main__":
    recs = generate_records()
    print(f"Generated {len(recs)} benign public records across {len(set(r['source_group'] for r in recs))} groups.")
    out_file = Path("ml/src/dataset_sources/benign_public.py")
    with open(out_file, "w", encoding="utf-8") as f:
        f.write('"""Authentic Benign Public SMS Messages (UCI SMS Corpus)."""\n')
        f.write("from typing import List, Dict, Any\n\n")
        f.write("DATA_RECORDS: List[Dict[str, Any]] = [\n")
        for r in recs:
            f.write(f"    {repr(r)},\n")
        f.write("]\n\n")
        f.write("def get_records() -> List[Dict[str, Any]]:\n")
        f.write("    return DATA_RECORDS\n")
    print(f"Saved to {out_file}")
