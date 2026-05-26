const Institution = require('../../models/institution.model');
const Student = require('../../models/student.model');
const Teacher = require('../../models/teacher.model');

class ComplianceAnalyticsService {
  
  // NIRF Parameter Tracking
  async calculateNIRFMetrics(institutionId) {
    const institution = await Institution.findById(institutionId);
    if (!institution) return null;
    
    const students = await Student.find({ institution: institutionId, isActive: true });
    const teachers = await Teacher.find({ institutionId, isActive: true });
    
    // NIRF has 5 main parameters
    const metrics = {
      // 1. Teaching, Learning & Resources (TLR) - 30%
      tlr: await this.calculateTLR(institution, students, teachers),
      
      // 2. Research and Professional Practice (RP) - 30%
      rp: await this.calculateRP(teachers),
      
      // 3. Graduation Outcomes (GO) - 20%
      go: await this.calculateGO(students, institution),
      
      // 4. Outreach and Inclusivity (OI) - 10%
      oi: await this.calculateOI(students, institution),
      
      // 5. Perception (PR) - 10%
      pr: { score: institution.nirfScore || 70, breakdown: { rating: institution.nirfScore || 70 } }
    };
    
    // Calculate overall NIRF score
    const overallScore = 
      (metrics.tlr.score * 0.30) +
      (metrics.rp.score * 0.30) +
      (metrics.go.score * 0.20) +
      (metrics.oi.score * 0.10) +
      (metrics.pr.score * 0.10);
    
    return {
      institutionId,
      institutionName: institution.name,
      overall: parseFloat(overallScore.toFixed(2)),
      parameters: metrics,
      complianceLevel: this.getComplianceLevel(overallScore),
      recommendations: this.generateRecommendations(metrics),
      ranking: institution.ranking,
      lastUpdated: new Date()
    };
  }
  
  //Teaching, Learning & Resources
  async calculateTLR(institution, students, teachers) {
    const studentTeacherRatio = teachers.length > 0 ? students.length / teachers.length : 0;
    const avgCGPA = students.length > 0 
      ? students.reduce((sum, s) => sum + (s.cgpa || 0), 0) / students.length 
      : 0;
    
    const qualifiedFaculty = teachers.filter(t => 
      t.designation.includes('Professor') || t.experience >= 5
    ).length;
    const facultyQualification = teachers.length > 0 ? qualifiedFaculty / teachers.length : 0;
    
    let score = 0;
    
    // Ideal ratio: 15:1 to 20:1 (max 30 points)
    if (studentTeacherRatio >= 15 && studentTeacherRatio <= 20) {
      score += 30;
    } else {
      score += Math.max(0, 30 - Math.abs(studentTeacherRatio - 17.5) * 2);
    }
    
    // CGPA contribution (max 40 points)
    score += (avgCGPA / 10) * 40;
    
    // Faculty qualification (max 30 points)
    score += facultyQualification * 30;
    
    return {
      score: Math.min(score, 100),
      breakdown: {
        studentTeacherRatio: studentTeacherRatio.toFixed(2),
        avgCGPA: avgCGPA.toFixed(2),
        qualifiedFaculty: `${qualifiedFaculty}/${teachers.length} (${(facultyQualification * 100).toFixed(1)}%)`
      }
    };
  }
  
  //Research and Professional Practice
  async calculateRP(teachers) {
    if (teachers.length === 0) return { score: 0, breakdown: {} };
    
    const totalPublications = teachers.reduce((sum, t) => sum + (t.publications || 0), 0);
    const avgHIndex = teachers.reduce((sum, t) => sum + (t.hIndex || 0), 0) / teachers.length;
    const activeProjects = teachers.reduce((sum, t) => sum + (t.projects || 0), 0);
    
    let score = 0;
    
    // Publications per faculty (max 50 points)
    const pubsPerFaculty = totalPublications / teachers.length;
    score += Math.min(pubsPerFaculty * 5, 50);
    
    // H-Index (max 30 points)
    score += Math.min(avgHIndex * 3, 30);
    
    // Active projects (max 20 points)
    const projectsPerFaculty = activeProjects / teachers.length;
    score += Math.min(projectsPerFaculty * 10, 20);
    
    return {
      score: Math.min(score, 100),
      breakdown: {
        totalPublications,
        avgHIndex: avgHIndex.toFixed(2),
        activeProjects,
        publicationsPerFaculty: pubsPerFaculty.toFixed(2)
      }
    };
  }
  
  //Graduation Outcomes
  async calculateGO(students, institution) {
    const placementRate = (institution.placement || 0) / 100;
    const avgCGPA = students.length > 0
      ? students.reduce((sum, s) => sum + (s.cgpa || 0), 0) / students.length
      : 0;
    
    let score = 0;
    
    // Placement rate (max 60 points)
    score += placementRate * 60;
    
    // Academic performance (max 40 points)
    score += (avgCGPA / 10) * 40;
    
    return {
      score: Math.min(score, 100),
      breakdown: {
        placementRate: `${(placementRate * 100).toFixed(1)}%`,
        avgCGPA: avgCGPA.toFixed(2)
      }
    };
  }
  
  // Outreach and Inclusivity
  async calculateOI(students, institution) {
    const scholarshipBeneficiaries = students.filter(s => 
      s.schemes && s.schemes.length > 0
    ).length;
    const diversityScore = students.length > 0 
      ? (scholarshipBeneficiaries / students.length) * 100 
      : 0;
    
    let score = Math.min(diversityScore * 0.8, 80) + 20; // Base 20 points
    
    return {
      score: Math.min(score, 100),
      breakdown: {
        scholarshipBeneficiaries: `${scholarshipBeneficiaries} (${diversityScore.toFixed(1)}%)`,
        totalStudents: students.length
      }
    };
  }
  
  getComplianceLevel(score) {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Satisfactory';
    return 'Needs Improvement';
  }
  
  generateRecommendations(metrics) {
    const recommendations = [];
    
    if (metrics.tlr.score < 60) {
      recommendations.push({
        category: 'TLR',
        priority: 'High',
        message: 'Improve student-teacher ratio and faculty qualifications',
        actionItems: [
          'Recruit more qualified faculty',
          'Enhance faculty development programs',
          'Reduce student intake or increase faculty strength'
        ]
      });
    }
    if (metrics.rp.score < 60) {
      recommendations.push({
        category: 'RP',
        priority: 'High',
        message: 'Increase research output and faculty publications',
        actionItems: [
          'Establish research incentive programs',
          'Provide research grants and funding',
          'Encourage collaborative research projects'
        ]
      });
    }
    if (metrics.go.score < 60) {
      recommendations.push({
        category: 'GO',
        priority: 'Medium',
        message: 'Focus on placement drives and career counseling',
        actionItems: [
          'Strengthen industry partnerships',
          'Enhance skill development programs',
          'Provide placement training and support'
        ]
      });
    }
    if (metrics.oi.score < 60) {
      recommendations.push({
        category: 'OI',
        priority: 'Medium',
        message: 'Expand scholarship programs and diversity initiatives',
        actionItems: [
          'Increase scholarship budget',
          'Reach out to underrepresented communities',
          'Implement inclusive admission policies'
        ]
      });
    }
    
    return recommendations;
  }
}

module.exports = new ComplianceAnalyticsService();