import React, { useState } from 'react';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';
import CourseEditor from '../components/CourseEditor';
import { courses as initialCourses } from '../data/mockData';

export default function Courses() {
  const [courses, setCourses] = useState(initialCourses);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);

  const handleAdd = () => {
    setCurrentCourse(null);
    setIsEditing(true);
  };

  const handleEdit = (course) => {
    setCurrentCourse(course);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const handleSave = (courseData) => {
    if (courseData.id) {
      setCourses(courses.map(c => c.id === courseData.id ? courseData : c));
    } else {
      setCourses([...courses, { ...courseData, id: `c${Date.now()}` }]);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <CourseEditor
        course={currentCourse}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Courses</h2>
          <p className="text-gray-400 mt-1">Manage golf courses and hole data</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-emerald-500/50 transition-colors">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-900/50 flex items-center justify-center text-emerald-400">
                    <MapPin size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-white">{course.name}</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(course)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-900/50 p-3 rounded-lg">
                  <span className="text-gray-500 block mb-1">Total Par</span>
                  <span className="text-white font-bold text-lg">
                    {course.holes.reduce((sum, h) => sum + h.par, 0)}
                  </span>
                </div>
                <div className="bg-gray-900/50 p-3 rounded-lg">
                  <span className="text-gray-500 block mb-1">Holes</span>
                  <span className="text-white font-bold text-lg">{course.holes.length}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
