class TransactionsController {
  constructor(transactionService) {
    this.transactionService = transactionService
  }

  async createTransaction(req, res) {
    try {
      const transactionData = req.body
      const newTransaction = await this.transactionService.createTransaction(transactionData)
      res.status(201).json(newTransaction)
    } catch (error) {
      res.status(500).json({ error: 'Failed to create transaction' })
    }
  }

  async getTransactionById(req, res) {
    try {
      const transactionId = req.params.id
      const transaction = await this.transactionService.getTransactionById(transactionId)
      if (transaction) {
        res.status(200).json(transaction)
      } else {
        res.status(404).json({ error: 'Transaction not found' })
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve transaction' })
    }
  }

  async getAllTransactions(req, res) {
    try {
      const transactions = await this.transactionService.getAllTransactions()
      res.status(200).json(transactions)
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve transactions' })
    }
  }
}

module.exports = new TransactionsController()
