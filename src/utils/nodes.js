import getImportGroup from './getImportGroup'
import getImportKind from './getImportKind'

const importGroups = ['builtin', 'external', 'parent', 'sibling', 'index', 'unknown', 'absolute']
const importKinds = ['named', 'default', 'all', 'none']

const lower = s => s && s.toLowerCase()

export function getFirstMemberName({ node }, forceLowercase) {
  const value = node && node.specifiers && node.specifiers[0] ? node.specifiers[0].local.name : null
  return forceLowercase ? lower(value) : value
}

export function alphabeticCompareNodes(first, second, ignoreCase) {
  const firstName = getFirstMemberName(first, ignoreCase)
  const secondName = getFirstMemberName(second, ignoreCase)
  if (firstName === secondName) return 0
  return firstName > secondName ? 1 : -1
}

export function compareNodes(first, second, ignoreCase) {
  if (first.groupRank > second.groupRank) return 1
  else if (first.groupRank < second.groupRank) return -1
  else if (first.kindRank > second.kindRank) return 1
  else if (first.kindRank < second.kindRank) return -1
  return alphabeticCompareNodes(first, second, ignoreCase)
}

function buildRank(groups, groupEnum) {
  const rankObject = groups.reduce((res, group, idx) => {
    if (typeof group === 'string') group = [ group ] // eslint-disable-line
    group.forEach(groupItem => {
      if (groupEnum.indexOf(groupItem) === -1)
        throw new Error(
          `Incorrect configuration of the rule: unknown type ${JSON.stringify(groupItem)}`
        )

      if (typeof res[groupItem] !== 'undefined')
        throw new Error(
          `Incorrect configuration of the rule: duplicate type ${JSON.stringify(groupItem)}`
        )

      res[groupItem] = idx
    })
    return res
  }, {})

  const omittedGroups = groupEnum.filter(group => rankObject[group] === undefined)

  return omittedGroups.reduce((res, group) => {
    res[group] = groupEnum.length
    return res
  }, rankObject)
}

export class NodeClassifier {
  constructor(context, groups = importGroups, importKindGroups = importKinds) {
    this.context = context
    this.groups = groups
    this.importKindGroups = importKindGroups
    this._buildRanks()
  }

  _buildRanks() {
    this.groupRank = buildRank(this.groups, importGroups)
    this.kindRank = buildRank(this.importKindGroups, importKinds)
  }

  rankNode(node, name, type) {
    return {
      node,
      name,
      groupRank: this.groupRank[getImportGroup(name, this.context)] + (type === 'import' ? 0 : 100),
      kindRank: this.kindRank[getImportKind(node)] + (type === 'import' ? 0 : 100),
    }
  }
}
