import streamlit as st

def render(model):
    st.header("Check Your Placement Chances")

    gender = st.selectbox("Gender", ["Male", "Female"])
    branch = st.selectbox("Branch", ["CSE", "Civil", "ECE", "EEE", "IT", "Mechanical"])
    cgpa = st.slider("CGPA", 0.0, 10.0, 7.0)
    backlogs = st.number_input("Number of Backlogs", min_value=0, max_value=20, value=0)
    ssc_marks = st.slider("SSC (10th) Marks", 0, 100, 70)
    hsc_marks = st.slider("HSC (12th) Marks", 0, 100, 70)
    internships = st.number_input("Number of Internships", min_value=0, max_value=10, value=0)
    projects = st.number_input("Number of Projects", min_value=0, max_value=20, value=0)
    workshops = st.number_input("Workshops/Certifications", min_value=0, max_value=20, value=0)
    technical_score = st.slider("Technical Skill Score", 0.0, 100.0, 50.0)
    coding_score = st.slider("Coding Platform Score", 0.0, 100.0, 50.0)
    github_score = st.slider("GitHub Score", 0.0, 10.0, 5.0)
    aptitude_score = st.slider("Aptitude Test Score", 0, 100, 50)
    soft_skills = st.slider("Soft Skills Rating", 0.0, 10.0, 5.0)
    extracurricular = st.selectbox("Extracurricular Activities", ["Yes", "No"])
    placement_training = st.selectbox("Placement Training", ["Yes", "No"])

    if st.button("Predict My Placement"):
        gender_val = 0 if gender == "Female" else 1
        branch_val = {"CSE": 0, "Civil": 1, "ECE": 2, "EEE": 3, "IT": 4, "Mechanical": 5}[branch]
        extracurricular_val = 0 if extracurricular == "No" else 1
        placement_training_val = 0 if placement_training == "No" else 1

        input_data = [[
            gender_val, branch_val, cgpa, backlogs, ssc_marks, hsc_marks,
            internships, projects, workshops, technical_score, coding_score,
            github_score, aptitude_score, soft_skills,
            extracurricular_val, placement_training_val
        ]]

        prediction = model.predict(input_data)[0]
        confidence = model.predict_proba(input_data)[0][prediction] * 100

        # Store in session state for analysis tab
        st.session_state['prediction'] = int(prediction)
        st.session_state['confidence'] = confidence
        st.session_state['user_inputs'] = {
            'cgpa': cgpa,
            'backlogs': backlogs,
            'ssc_marks': ssc_marks,
            'hsc_marks': hsc_marks,
            'internships': internships,
            'projects': projects,
            'workshops': workshops,
            'technical_score': technical_score,
            'coding_score': coding_score,
            'github_score': github_score,
            'aptitude_score': aptitude_score,
            'soft_skills': soft_skills,
        }

        if prediction == 1:
            st.success(f"✅ Likely to be Placed! Confidence: {confidence:.1f}%")
            st.info("👉 Go to the **Profile Analysis** tab to see your detailed breakdown.")
        else:
            st.error(f"❌ May Not be Placed. Confidence: {confidence:.1f}%")
            st.info("👉 Go to the **Profile Analysis** tab to see what you can improve.")