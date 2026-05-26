const Student = require('../../models/student.model');

class PredictiveAnalyticsService {
  
  async calculateDropoutRisk(studentId) {
    const student = await Student.findById(studentId);
    if (!student) return null;
    
    let riskScore = 0;
    const factors = [];
    
    // Factor 1: Low CGPA (weight: 35%)
    if (student.cgpa < 5.0) {
      riskScore += 35;
      factors.push('Critical CGPA below 5.0');
    } else if (student.cgpa < 6.0) {
      riskScore += 25;
      factors.push('CGPA below minimum threshold');
    }
    
    // Factor 2: Low attendance (weight: 30%)
    if (student.attendance < 65) {
      riskScore += 30;
      factors.push('Critical attendance below 65%');
    } else if (student.attendance < 75) {
      riskScore += 20;
      factors.push('Poor attendance record');
    }
    
    // Factor 3: Incomplete assignments (weight: 20%)
    if (student.assignments < 50) {
      riskScore += 20;
      factors.push('Very low assignment completion');
    } else if (student.assignments < 70) {
      riskScore += 10;
      factors.push('Low assignment completion rate');
    }
    
    // Factor 4: Late semester indicator (weight: 15%)
    if (student.semester >= 5 && (student.cgpa < 6.5 || student.attendance < 75)) {
      riskScore += 15;
      factors.push('Performance concerns in later semesters');
    }
    
    return {
      studentId: student._id,
      name: student.name,
      email: student.email,
      apaarId: student.apaarId,
      course: student.course,
      semester: student.semester,
      score: Math.min(riskScore, 100),
      level: riskScore >= 70 ? 'High' : riskScore >= 40 ? 'Medium' : 'Low',
      factors,
      confidence: 85,
      recommendation: this.getRecommendation(riskScore),
      currentMetrics: {
        cgpa: student.cgpa,
        attendance: student.attendance,
        assignments: student.assignments
      }
    };
  }
  
  async analyzeInstitutionRisks(institutionId) {
    const students = await Student.find({ 
      institution: institutionId,
      isActive: true 
    });
    
    console.log(`Found ${students.length} students for institution ${institutionId}`);
    
    const riskAnalysis = {
      highRisk: [],
      mediumRisk: [],
      lowRisk: [],
      summary: {
        total: students.length,
        highRiskCount: 0,
        mediumRiskCount: 0,
        lowRiskCount: 0,
        avgRiskScore: 0
      }
    };
    
    if (students.length === 0) {
      return riskAnalysis;
    }
    
    let totalRiskScore = 0;
    
    for (const student of students) {
      const risk = await this.calculateDropoutRisk(student._id);
      if (!risk) continue;
      
      totalRiskScore += risk.score;
      
      const studentRisk = {
        studentId: student._id,
        name: student.name,
        email: student.email,
        apaarId: student.apaarId,
        course: student.course,
        semester: student.semester,
        riskScore: risk.score,
        riskLevel: risk.level,
        factors: risk.factors,
        currentMetrics: risk.currentMetrics
      };
      
      if (risk.score >= 70) {
        riskAnalysis.highRisk.push(studentRisk);
        riskAnalysis.summary.highRiskCount++;
      } else if (risk.score >= 40) {
        riskAnalysis.mediumRisk.push(studentRisk);
        riskAnalysis.summary.mediumRiskCount++;
      } else {
        riskAnalysis.lowRisk.push(studentRisk);
        riskAnalysis.summary.lowRiskCount++;
      }
    }
    
    riskAnalysis.summary.avgRiskScore = students.length > 0 
      ? (totalRiskScore / students.length).toFixed(2) 
      : 0;
    
    return riskAnalysis;
  }
  
  async forecastPerformance(institutionId) {
    const students = await Student.find({ 
      institution: institutionId,  
      isActive: true 
    });
    
    const semesterGroups = {};
    
    students.forEach(student => {
      if (!semesterGroups[student.semester]) {
        semesterGroups[student.semester] = {
          count: 0,
          totalCGPA: 0,
          totalAttendance: 0
        };
      }
      semesterGroups[student.semester].count++;
      semesterGroups[student.semester].totalCGPA += student.cgpa || 0;
      semesterGroups[student.semester].totalAttendance += student.attendance || 0;
    });
    
    const forecast = [];
    for (let sem = 1; sem <= 8; sem++) {
      const group = semesterGroups[sem];
      if (group) {
        forecast.push({
          semester: sem,
          avgCGPA: (group.totalCGPA / group.count).toFixed(2),
          avgAttendance: (group.totalAttendance / group.count).toFixed(2),
          studentCount: group.count
        });
      }
    }
    
    return forecast;
  }
  
  getRecommendation(riskScore) {
    if (riskScore >= 70) {
      return 'CRITICAL: Immediate intervention required. Schedule counseling session and parental meeting.';
    } else if (riskScore >= 40) {
      return 'MODERATE: Monitor closely. Consider academic support programs and mentorship.';
    } else {
      return 'LOW: Student on track. Continue regular monitoring.';
    }
  }
}

module.exports = new PredictiveAnalyticsService();