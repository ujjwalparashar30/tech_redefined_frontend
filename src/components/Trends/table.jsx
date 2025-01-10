import React from 'react';
import { Link } from 'react-router-dom';

const TopCreatorsTable = ({ creatorsData }) => {
  // Default data structure if props aren't provided
  const defaultData = [
    { name: 'Alice', engagement: 1200, growth: 15 },
    { name: 'Bob', engagement: 1100, growth: 10 },
    { name: 'Charlie', engagement: 950, growth: -5 },
    { name: 'Diana', engagement: 900, growth: 8 },
  ];

  const data = creatorsData || defaultData;

  return (
    <div className="w-full bg-[#181414] rounded-lg p-10 mt-10">
      <div className="mb-6">
        <h2 className="text-3xl text-center font-semibold text-white">Top 5 Creators of the Week</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-3 px-4 text-left text-white font-semibold">Creator</th>
              <th className="py-3 px-4 text-right text-white font-semibold">Toatal Likes</th>
              <th className="py-3 px-4 text-right text-white font-semibold">Posts Upload</th>
            </tr>
          </thead>
          <tbody>
            {data.map((creator, index) => (
              <tr 
                key={index} 
                className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors"
              >
                <td className="py-3 px-4 text-white"><Link to={`/profile/${creator._id}`}>{creator.username}</Link></td>
                <td className="py-3 px-4 text-right text-white">{creator.totalLikes}</td>
                <td className="py-3 px-4 text-right">
                  {creator.posts.length}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopCreatorsTable;
