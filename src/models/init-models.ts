import type { Sequelize } from "sequelize";
import { Edge as _Edge } from "./Edge";
import type { EdgeAttributes, EdgeCreationAttributes } from "./Edge";
import { Graph as _Graph } from "./Graph";
import type { GraphAttributes, GraphCreationAttributes } from "./Graph";
import { UpdateLog as _UpdateLog } from "./UpdateLog";
import type { UpdateLogAttributes, UpdateLogCreationAttributes } from "./UpdateLog";
import { User as _User } from "./User";
import type { UserAttributes, UserCreationAttributes } from "./User";

export {
  _Edge as Edge,
  _Graph as Graph,
  _UpdateLog as UpdateLog,
  _User as User,
};

export type {
  EdgeAttributes,
  EdgeCreationAttributes,
  GraphAttributes,
  GraphCreationAttributes,
  UpdateLogAttributes,
  UpdateLogCreationAttributes,
  UserAttributes,
  UserCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const Edge = _Edge.initModel(sequelize);
  const Graph = _Graph.initModel(sequelize);
  const UpdateLog = _UpdateLog.initModel(sequelize);
  const User = _User.initModel(sequelize);

  UpdateLog.belongsTo(Edge, { as: "edge", foreignKey: "edgeId"});
  Edge.hasMany(UpdateLog, { as: "updateLogs", foreignKey: "edgeId"});
  Edge.belongsTo(Graph, { as: "graph", foreignKey: "graphId"});
  Graph.hasMany(Edge, { as: "edges", foreignKey: "graphId"});
  Graph.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(Graph, { as: "graphs", foreignKey: "userId"});
  UpdateLog.belongsTo(User, { as: "resolvedByUser", foreignKey: "resolvedBy"});
  User.hasMany(UpdateLog, { as: "updateLogs", foreignKey: "resolvedBy"});
  UpdateLog.belongsTo(User, { as: "requestedByUser", foreignKey: "requestedBy"});
  User.hasMany(UpdateLog, { as: "requestedByUpdateLogs", foreignKey: "requestedBy"});

  return {
    Edge: Edge,
    Graph: Graph,
    UpdateLog: UpdateLog,
    User: User,
  };
}
