import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Circle, Line, Arrow, Text, Transformer } from 'react-konva';
import { FaRegCircle, FaLongArrowAltRight, FaFont, FaUsers } from 'react-icons/fa';
import { TbRectangle } from 'react-icons/tb';
import { LuPencil } from 'react-icons/lu';
import { GiArrowCursor } from 'react-icons/gi';
import { IoMdDownload } from 'react-icons/io';
import { v4 as uuidv4 } from 'uuid';

const ACTIONS = {
  SELECT: 'select',
  RECTANGLE: 'rectangle',
  CIRCLE: 'circle',
  ARROW: 'arrow',
  SCRIBBLE: 'scribble',
  TEXT: 'text'
};

const DrawingRoom = ({ roomId, ws, onLeaveRoom , user}) => {
  const [participants, setParticipants] = useState([]);
  const [showParticipants, setShowParticipants] = useState(false);
  const [action, setAction] = useState(ACTIONS.SELECT);
  const [fillColor, setFillColor] = useState('#000000');
  const [shapes, setShapes] = useState({
    rectangles: [],
    circles: [],
    arrows: [],
    scribbles: [],
    text: []
  });
  const [selectedId, setSelectedId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  const stageRef = useRef();
  const isPainting = useRef(false);
  const currentShapeId = useRef(null);
  const transformerRef = useRef();

  useEffect(() => {
    if (!ws) return;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case 'shape-update':
          setShapes(data.shapes);
          break;
        case 'participants-update':
          setParticipants(data.participants);
          break;
      }
    };
  }, [ws]);

  const broadcastShapes = (newShapes) => {
    ws.send(JSON.stringify({
      type: 'shape-update',
      roomId,
      shapes: newShapes
    }));
  };

  const handleMouseDown = (e) => {
    if (action === ACTIONS.SELECT) {
      const clickedOnEmpty = e.target === e.target.getStage();
      if (clickedOnEmpty) {
        setSelectedId(null);
        return;
      }
      setSelectedId(e.target.id());
      return;
    }

    const pos = e.target.getStage().getPointerPosition();
    isPainting.current = true;
    currentShapeId.current = uuidv4();

    const newShape = {
      id: currentShapeId.current,
      x: pos.x,
      y: pos.y,
      fill: fillColor
    };

    setShapes(prev => {
      const updated = { ...prev };
      switch (action) {
        case ACTIONS.RECTANGLE:
          updated.rectangles = [...prev.rectangles, { ...newShape, width: 0, height: 0 }];
          break;
        case ACTIONS.CIRCLE:
          updated.circles = [...prev.circles, { ...newShape, radius: 0 }];
          break;
        case ACTIONS.ARROW:
          updated.arrows = [...prev.arrows, { ...newShape, points: [pos.x, pos.y, pos.x, pos.y] }];
          break;
        case ACTIONS.SCRIBBLE:
          updated.scribbles = [...prev.scribbles, { ...newShape, points: [pos.x, pos.y] }];
          break;
        case ACTIONS.TEXT:
          updated.text = [...prev.text, { ...newShape, text: '', fontSize: 20 }];
          setIsTyping(true);
          break;
      }
      broadcastShapes(updated);
      return updated;
    });
  };

  const handleMouseMove = (e) => {
    if (!isPainting.current) return;

    const pos = e.target.getStage().getPointerPosition();
    
    setShapes(prev => {
      const updated = { ...prev };
      switch (action) {
        case ACTIONS.RECTANGLE:
          updated.rectangles = prev.rectangles.map(r => {
            if (r.id === currentShapeId.current) {
              return {
                ...r,
                width: pos.x - r.x,
                height: pos.y - r.y
              };
            }
            return r;
          });
          break;
        case ACTIONS.CIRCLE:
          updated.circles = prev.circles.map(c => {
            if (c.id === currentShapeId.current) {
              const dx = pos.x - c.x;
              const dy = pos.y - c.y;
              return {
                ...c,
                radius: Math.sqrt(dx * dx + dy * dy)
              };
            }
            return c;
          });
          break;
        case ACTIONS.ARROW:
          updated.arrows = prev.arrows.map(a => {
            if (a.id === currentShapeId.current) {
              return {
                ...a,
                points: [a.points[0], a.points[1], pos.x, pos.y]
              };
            }
            return a;
          });
          break;
        case ACTIONS.SCRIBBLE:
          updated.scribbles = prev.scribbles.map(s => {
            if (s.id === currentShapeId.current) {
              return {
                ...s,
                points: [...s.points, pos.x, pos.y]
              };
            }
            return s;
          });
          break;
      }
      broadcastShapes(updated);
      return updated;
    });
  };

  const handleMouseUp = () => {
    isPainting.current = false;
  };

  const handleTextEdit = (id, newText) => {
    setShapes(prev => {
      const updated = {
        ...prev,
        text: prev.text.map(t => 
          t.id === id ? { ...t, text: newText } : t
        )
      };
      broadcastShapes(updated);
      return updated;
    });
  };

  const handleDragEnd = (e, id, type) => {
    setShapes(prev => {
      const updated = {
        ...prev,
        [type]: prev[type].map(shape => 
          shape.id === id ? {
            ...shape,
            x: e.target.x(),
            y: e.target.y()
          } : shape
        )
      };
      broadcastShapes(updated);
      return updated;
    });
  };

  const handleTransformEnd = (e, id, type) => {
    const node = e.target;
    setShapes(prev => {
      const updated = {
        ...prev,
        [type]: prev[type].map(shape => 
          shape.id === id ? {
            ...shape,
            x: node.x(),
            y: node.y(),
            width: node.width() * node.scaleX(),
            height: node.height() * node.scaleY(),
            rotation: node.rotation()
          } : shape
        )
      };
      broadcastShapes(updated);
      return updated;
    });
  };

  return (
    <div className="relative h-screen bg-black">
      <div className="absolute top-0 left-0 right-0 z-10 shadow-md bg-gray-900 text-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Room: {roomId}</span>
            <button
              onClick={() => setShowParticipants(!showParticipants)}
              className="p-2 hover:bg-gray-700 rounded-full"
            >
              <FaUsers className="text-gray-200" />
            </button>
          </div>
  
          <div className="flex gap-2">
            <button
              className={`p-2 rounded ${action === ACTIONS.SELECT ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              onClick={() => setAction(ACTIONS.SELECT)}
            >
              <GiArrowCursor className="text-gray-200" />
            </button>
            <button
              className={`p-2 rounded ${action === ACTIONS.RECTANGLE ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              onClick={() => setAction(ACTIONS.RECTANGLE)}
            >
              <TbRectangle className="text-gray-200" />
            </button>
            <button
              className={`p-2 rounded ${action === ACTIONS.CIRCLE ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              onClick={() => setAction(ACTIONS.CIRCLE)}
            >
              <FaRegCircle className="text-gray-200" />
            </button>
            <button
              className={`p-2 rounded ${action === ACTIONS.ARROW ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              onClick={() => setAction(ACTIONS.ARROW)}
            >
              <FaLongArrowAltRight className="text-gray-200" />
            </button>
            <button
              className={`p-2 rounded ${action === ACTIONS.SCRIBBLE ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              onClick={() => setAction(ACTIONS.SCRIBBLE)}
            >
              <LuPencil className="text-gray-200" />
            </button>
            <button
              className={`p-2 rounded ${action === ACTIONS.TEXT ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              onClick={() => setAction(ACTIONS.TEXT)}
            >
              <FaFont className="text-gray-200" />
            </button>
            <input
              type="color"
              value={fillColor}
              onChange={(e) => setFillColor(e.target.value)}
              className="w-8 h-8 p-0 border-0 bg-gray-800 rounded-full"
            />
            <button
              onClick={() => {
                const dataURL = stageRef.current.toDataURL();
                const link = document.createElement('a');
                link.download = 'drawing.png';
                link.href = dataURL;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="p-2 hover:bg-gray-700 rounded"
            >
              <IoMdDownload className="text-gray-200" />
            </button>
          </div>
  
          <button
            onClick={onLeaveRoom}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Leave Room
          </button>
        </div>
      </div>
  
      {showParticipants && (
        <div className="absolute top-16 right-0 w-64 bg-gray-800 shadow-lg z-10 p-4 text-gray-100">
          <h3 className="font-bold mb-2">Participants ({participants.length})</h3>
          {participants.map(participant => (
            <div key={participant.id} className="py-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>{participant.id}</span>
            </div>
          ))}
        </div>
      )}
  
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          <Rect
            width={window.innerWidth}
            height={window.innerHeight}
            fill="#1a1a1a"
          />
  
          {shapes.rectangles.map(rect => (
            <Rect
              key={rect.id}
              {...rect}
              draggable={action === ACTIONS.SELECT}
              onDragEnd={(e) => handleDragEnd(e, rect.id, 'rectangles')}
              onTransformEnd={(e) => handleTransformEnd(e, rect.id, 'rectangles')}
            />
          ))}
  
          {shapes.circles.map(circle => (
            <Circle
              key={circle.id}
              {...circle}
              draggable={action === ACTIONS.SELECT}
              onDragEnd={(e) => handleDragEnd(e, circle.id, 'circles')}
            />
          ))}
  
          {shapes.arrows.map(arrow => (
            <Arrow
              key={arrow.id}
              {...arrow}
              draggable={action === ACTIONS.SELECT}
              onDragEnd={(e) => handleDragEnd(e, arrow.id, 'arrows')}
            />
          ))}
  
          {shapes.scribbles.map(scribble => (
            <Line
              key={scribble.id}
              {...scribble}
              stroke={scribble.fill}
              strokeWidth={2}
              tension={0.5}
              lineCap="round"
              draggable={action === ACTIONS.SELECT}
              onDragEnd={(e) => handleDragEnd(e, scribble.id, 'scribbles')}
            />
          ))}
  
          {shapes.text.map(text => (
            <Text
              key={text.id}
              {...text}
              draggable={action === ACTIONS.SELECT}
              onDblClick={() => {
                setSelectedId(text.id);
                setIsTyping(true);
              }}
              onDragEnd={(e) => handleDragEnd(e, text.id, 'text')}
            />
          ))}
  
          {selectedId && action === ACTIONS.SELECT && (
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                return newBox;
              }}
            />
          )}
        </Layer>
      </Stage>
    </div>
  )}

export default DrawingRoom;