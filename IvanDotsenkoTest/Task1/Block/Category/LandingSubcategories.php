<?php
declare(strict_types=1);

namespace IvanDotsenkoTest\Task1\Block\Category;

use Magento\Catalog\Model\Category;
use Magento\Catalog\Model\Layer\Resolver as LayerResolver;
use Magento\Framework\View\Element\Template;
use Magento\Framework\View\Element\Template\Context;

class LandingSubcategories extends Template
{
    /**
     * @var LayerResolver
     */
    private $layerResolver;

    /**
     * @param Context $context
     * @param LayerResolver $layerResolver
     * @param array $data
     */
    public function __construct(
        Context $context,
        LayerResolver $layerResolver,
        array $data = []
    ) {
        $this->layerResolver = $layerResolver;
        parent::__construct($context, $data);
    }

    /**
     * Get current category
     *
     * @return Category
     */
    public function getCurrentCategory()
    {
        return $this->layerResolver->get()->getCurrentCategory();
    }

    /**
     * Check if category is landing category
     *
     * @return bool
     */
    public function isLandingCategory(): bool
    {
        $category = $this->getCurrentCategory();
        return (bool)$category->getData('is_landing_category');
    }

    /**
     * Get active direct subcategories
     *
     * @return Category[]
     */
    public function getSubcategories()
    {
        $category = $this->getCurrentCategory();
        if (!$category) {
            return [];
        }
        return $category->getChildrenCategories();
    }
}
