import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';

export default function CourseEditor({ course, onSave, onCancel }) {
  const [name, setName] = useState(course?.name || '');
  const [holes, setHoles] = useState(
    course?.holes || Array.from({ length: 18 }, (_, i) => ({ number: i + 1, par: 4, handicap: i + 1 }))
  );

  const handleHoleChange = (index, field, value) => {
    const newHoles = [...holes];
    newHoles[index] = { ...newHoles[index], [field]: parseInt(value) || 0 };
    setHoles(newHoles);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...course, name, holes });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">{course ? 'Edit Course' : 'Add New Course'}</h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-2">Course Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Front 9 */}
        <div>
          <h3 className="text-emerald-400 font-medium mb-3 uppercase tracking-wider text-sm">Front 9</h3>
          <div className="grid grid-cols-3 gap-2 mb-2 text-xs text-gray-500 font-medium text-center">
            <div>Hole</div>
            <div>Par</div>
            <div>HCP</div>
          </div>
          {holes.slice(0, 9).map((hole, i) => (
            <div key={hole.number} className="grid grid-cols-3 gap-2 mb-2">
              <div className="flex items-center justify-center bg-gray-900 rounded text-gray-300 font-medium">
                {hole.number}
              </div>
              <input
                type="number"
                value={hole.par}
                onChange={(e) => handleHoleChange(i, 'par', e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-center text-white focus:border-emerald-500"
                min="3" max="6"
              />
              <input
                type="number"
                value={hole.handicap}
                onChange={(e) => handleHoleChange(i, 'handicap', e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-center text-white focus:border-emerald-500"
                min="1" max="18"
              />
            </div>
          ))}
        </div>

        {/* Back 9 */}
        <div>
          <h3 className="text-emerald-400 font-medium mb-3 uppercase tracking-wider text-sm">Back 9</h3>
          <div className="grid grid-cols-3 gap-2 mb-2 text-xs text-gray-500 font-medium text-center">
            <div>Hole</div>
            <div>Par</div>
            <div>HCP</div>
          </div>
          {holes.slice(9, 18).map((hole, i) => (
            <div key={hole.number} className="grid grid-cols-3 gap-2 mb-2">
              <div className="flex items-center justify-center bg-gray-900 rounded text-gray-300 font-medium">
                {hole.number}
              </div>
              <input
                type="number"
                value={hole.par}
                onChange={(e) => handleHoleChange(i + 9, 'par', e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-center text-white focus:border-emerald-500"
                min="3" max="6"
              />
              <input
                type="number"
                value={hole.handicap}
                onChange={(e) => handleHoleChange(i + 9, 'handicap', e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-center text-white focus:border-emerald-500"
                min="1" max="18"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Save size={18} />
          Save Course
        </button>
      </div>
    </form>
  );
}
