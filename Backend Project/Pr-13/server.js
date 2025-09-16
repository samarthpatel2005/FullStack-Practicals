const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3013;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Helper function to validate and parse income values
function validateIncome(value) {
    if (!value || value.trim() === '') {
        return { isValid: false, error: 'Income field cannot be empty' };
    }
    
    // Remove any currency symbols and commas
    const cleanValue = value.toString().replace(/[$,\s]/g, '');
    
    // Check if it's a valid number
    if (isNaN(cleanValue) || cleanValue === '') {
        return { isValid: false, error: 'Please enter a valid numeric amount' };
    }
    
    const numValue = parseFloat(cleanValue);
    
    // Check for negative values
    if (numValue < 0) {
        return { isValid: false, error: 'Income cannot be negative' };
    }
    
    // Check for reasonable limits (max 10 million)
    if (numValue > 10000000) {
        return { isValid: false, error: 'Income amount is too large (max: $10,000,000)' };
    }
    
    return { isValid: true, value: numValue };
}

// Helper function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

// Helper function to calculate tax bracket (simplified)
function calculateTaxInfo(totalIncome) {
    let taxRate = 0;
    let taxBracket = '';
    
    if (totalIncome <= 10275) {
        taxRate = 10;
        taxBracket = '10% (Single: $0 - $10,275)';
    } else if (totalIncome <= 41775) {
        taxRate = 12;
        taxBracket = '12% (Single: $10,276 - $41,775)';
    } else if (totalIncome <= 89450) {
        taxRate = 22;
        taxBracket = '22% (Single: $41,776 - $89,450)';
    } else if (totalIncome <= 190750) {
        taxRate = 24;
        taxBracket = '24% (Single: $89,451 - $190,750)';
    } else if (totalIncome <= 364200) {
        taxRate = 32;
        taxBracket = '32% (Single: $190,751 - $364,200)';
    } else if (totalIncome <= 462500) {
        taxRate = 35;
        taxBracket = '35% (Single: $364,201 - $462,500)';
    } else {
        taxRate = 37;
        taxBracket = '37% (Single: $462,501+)';
    }
    
    return { taxRate, taxBracket };
}

// Routes
app.get('/', (req, res) => {
    res.render('tax-form', {
        result: null,
        error: null,
        income1: '',
        income2: '',
        source1: '',
        source2: ''
    });
});

app.post('/calculate-income', (req, res) => {
    const { income1, income2, source1, source2 } = req.body;
    let error = null;
    let result = null;
    
    try {
        // Validate income sources
        if (!source1 || source1.trim() === '') {
            throw new Error('Please specify the first income source');
        }
        if (!source2 || source2.trim() === '') {
            throw new Error('Please specify the second income source');
        }
        
        // Validate income amounts
        const income1Validation = validateIncome(income1);
        if (!income1Validation.isValid) {
            throw new Error(`First Income: ${income1Validation.error}`);
        }
        
        const income2Validation = validateIncome(income2);
        if (!income2Validation.isValid) {
            throw new Error(`Second Income: ${income2Validation.error}`);
        }
        
        // Calculate total income (server-side only)
        const totalIncome = income1Validation.value + income2Validation.value;
        
        // Get tax information
        const taxInfo = calculateTaxInfo(totalIncome);
        
        // Calculate estimated tax (simplified)
        const estimatedTax = totalIncome * (taxInfo.taxRate / 100);
        const netIncome = totalIncome - estimatedTax;
        
        result = {
            income1: {
                source: source1.trim(),
                amount: income1Validation.value,
                formatted: formatCurrency(income1Validation.value)
            },
            income2: {
                source: source2.trim(),
                amount: income2Validation.value,
                formatted: formatCurrency(income2Validation.value)
            },
            totalIncome: totalIncome,
            totalFormatted: formatCurrency(totalIncome),
            taxRate: taxInfo.taxRate,
            taxBracket: taxInfo.taxBracket,
            estimatedTax: estimatedTax,
            estimatedTaxFormatted: formatCurrency(estimatedTax),
            netIncome: netIncome,
            netIncomeFormatted: formatCurrency(netIncome),
            timestamp: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };
        
        console.log(`Tax calculation completed: Total Income: ${formatCurrency(totalIncome)}, Tax Rate: ${taxInfo.taxRate}%`);
        
    } catch (err) {
        error = err.message;
        console.error('Tax calculation error:', err.message);
    }
    
    res.render('tax-form', {
        result,
        error,
        income1: income1 || '',
        income2: income2 || '',
        source1: source1 || '',
        source2: source2 || ''
    });
});

// Clear form route
app.post('/clear-form', (req, res) => {
    res.render('tax-form', {
        result: null,
        error: null,
        income1: '',
        income2: '',
        source1: '',
        source2: ''
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('tax-form', {
        result: null,
        error: 'An internal server error occurred. Please try again.',
        income1: '',
        income2: '',
        source1: '',
        source2: ''
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).send(`
        <div style="text-align: center; font-family: Arial, sans-serif; padding: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; color: white;">
            <h1 style="font-size: 3rem; margin-bottom: 20px;">404 - Page Not Found</h1>
            <p style="font-size: 1.2rem; margin-bottom: 30px;">The page you're looking for doesn't exist.</p>
            <a href="/" style="background: white; color: #667eea; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 1.1rem;">Return to Tax Form</a>
        </div>
    `);
});

app.listen(PORT, () => {
    console.log(`💰 Tax Form Calculator is running on http://localhost:${PORT}`);
    console.log(`📊 Ready to calculate total income from multiple sources!`);
});