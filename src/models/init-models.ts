import type { Sequelize } from "sequelize";
import { Edges as _Edges } from "./edges";
import type { EdgesAttributes, EdgesCreationAttributes } from "./edges";
import { Graphs as _Graphs } from "./graphs";
import type { GraphsAttributes, GraphsCreationAttributes } from "./graphs";
import { UpdateLogs as _UpdateLogs } from "./update-logs";
import type { UpdateLogsAttributes, UpdateLogsCreationAttributes } from "./update-logs";
import { Users as _Users } from "./users";
import type { UsersAttributes, UsersCreationAttributes } from "./users";

export {
  _Edges as Edges,
  _Graphs as Graphs,
  _UpdateLogs as UpdateLogs,
  _Users as Users,
};

export type {
  EdgesAttributes,
  EdgesCreationAttributes,
  GraphsAttributes,
  GraphsCreationAttributes,
  UpdateLogsAttributes,
  UpdateLogsCreationAttributes,
  UsersAttributes,
  UsersCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const Edges = _Edges.initModel(sequelize);
  const Graphs = _Graphs.initModel(sequelize);
  const UpdateLogs = _UpdateLogs.initModel(sequelize);
  const Users = _Users.initModel(sequelize);

  UpdateLogs.belongsTo(Edges, { as: "edge", foreignKey: "edgeId"});
  Edges.hasMany(UpdateLogs, { as: "updateLogs", foreignKey: "edgeId"});
  Edges.belongsTo(Graphs, { as: "graph", foreignKey: "graphId"});
  Graphs.hasMany(Edges, { as: "edges", foreignKey: "graphId"});
  Graphs.belongsTo(Users, { as: "user", foreignKey: "userId"});
  Users.hasMany(Graphs, { as: "graphs", foreignKey: "userId"});
  UpdateLogs.belongsTo(Users, { as: "resolvedByUser", foreignKey: "resolvedBy"});
  Users.hasMany(UpdateLogs, { as: "updateLogs", foreignKey: "resolvedBy"});
  UpdateLogs.belongsTo(Users, { as: "requestedByUser", foreignKey: "requestedBy"});
  Users.hasMany(UpdateLogs, { as: "requestedByUpdateLogs", foreignKey: "requestedBy"});

  return {
    Edges: Edges,
    Graphs: Graphs,
    UpdateLogs: UpdateLogs,
    Users: Users,
  };
}
