const db = require('../models/index.js')

class FundCategoriesServices {
  async getFundCategories({ page, limit, search }) {
    page = parseInt(page) || 1
    limit = parseInt(limit) || 10
    const whereClause = {}

    if (search) {
      whereClause.categoryName = {
        [db.Sequelize.Op.like]: `%${search}%`
      }
    }

    const data = await db.CategoryFundraising.findAndCountAll({
      where: whereClause,
      limit,
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']]
    })
    return {
      data: data.rows,
      pagination: {
        total: data.count,
        page,
        limit
      }
    }
  }
  async isExistCategoryName(categoryName) {
    const response = await db.CategoryFundraising.findOne({ where: { categoryName } })
    if (!response) return false
    const { dataValues: category } = response
    return !!category
  }

  async createFundCategory({ categoryName, logoIcon }) {
    const newCategory = await db.CategoryFundraising.create({ categoryName, logoIcon })
    return newCategory
  }
}
module.exports = new FundCategoriesServices()
