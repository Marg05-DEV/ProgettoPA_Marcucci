import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Edges, EdgesId } from './edges';
import type { Users, UsersId } from './users';

export interface GraphsAttributes {
  graphId: number;
  userId: number;
  name: string;
  description?: string;
  cost: number;
  createdAt: Date;
  updatedAt: Date;
}

export type GraphsPk = "graphId";
export type GraphsId = Graphs[GraphsPk];
export type GraphsOptionalAttributes = "graphId" | "description" | "cost" | "createdAt" | "updatedAt";
export type GraphsCreationAttributes = Optional<GraphsAttributes, GraphsOptionalAttributes>;

export class Graphs extends Model<GraphsAttributes, GraphsCreationAttributes> implements GraphsAttributes {
  graphId!: number;
  userId!: number;
  name!: string;
  description?: string;
  cost!: number;
  createdAt!: Date;
  updatedAt!: Date;

  // Graphs hasMany Edges via graphId
  edges!: Edges[];
  getEdges!: Sequelize.HasManyGetAssociationsMixin<Edges>;
  setEdges!: Sequelize.HasManySetAssociationsMixin<Edges, EdgesId>;
  addEdge!: Sequelize.HasManyAddAssociationMixin<Edges, EdgesId>;
  addEdges!: Sequelize.HasManyAddAssociationsMixin<Edges, EdgesId>;
  createEdge!: Sequelize.HasManyCreateAssociationMixin<Edges>;
  removeEdge!: Sequelize.HasManyRemoveAssociationMixin<Edges, EdgesId>;
  removeEdges!: Sequelize.HasManyRemoveAssociationsMixin<Edges, EdgesId>;
  hasEdge!: Sequelize.HasManyHasAssociationMixin<Edges, EdgesId>;
  hasEdges!: Sequelize.HasManyHasAssociationsMixin<Edges, EdgesId>;
  countEdges!: Sequelize.HasManyCountAssociationsMixin;
  // Graphs belongsTo Users via userId
  user!: Users;
  getUser!: Sequelize.BelongsToGetAssociationMixin<Users>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<Users, UsersId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<Users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Graphs {
    return Graphs.init({
    graphId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'graph_id'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      },
      field: 'user_id'
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cost: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now'),
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now'),
      field: 'updated_at'
    }
  }, {
    sequelize,
    tableName: 'graphs',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "graphs_pkey",
        unique: true,
        fields: [
          { name: "graph_id" },
        ]
      },
    ]
  });
  }
}
